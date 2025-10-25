import pytest
from httpx import AsyncClient, ASGITransport
from aitxhackathon.app import app, stats_store


@pytest.fixture(autouse=True)
def reset_stats():
    """Reset stats store before each test."""
    stats_store["correct"]["IMAGE"] = 10
    stats_store["correct"]["AUDIO"] = 7
    stats_store["correct"]["VIDEO"] = 0
    stats_store["correct"]["SIMULATION"] = 0
    stats_store["incorrect"]["IMAGE"] = 10
    stats_store["incorrect"]["AUDIO"] = 7
    stats_store["incorrect"]["VIDEO"] = 0
    stats_store["incorrect"]["SIMULATION"] = 0
    yield


@pytest.mark.asyncio
async def test_submit_correct_image():
    """Test submitting a correct IMAGE response."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/submit",
            json={"type": "IMAGE", "correct": True}
        )

    assert response.status_code == 200
    data = response.json()
    assert data["correct"]["IMAGE"] == 11
    assert data["correct"]["AUDIO"] == 7
    assert data["correct"]["VIDEO"] == 0
    assert data["correct"]["SIMULATION"] == 0
    assert data["incorrect"]["IMAGE"] == 10
    assert data["incorrect"]["AUDIO"] == 7
    assert data["incorrect"]["VIDEO"] == 0
    assert data["incorrect"]["SIMULATION"] == 0


@pytest.mark.asyncio
async def test_submit_incorrect_audio():
    """Test submitting an incorrect AUDIO response."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/submit",
            json={"type": "AUDIO", "correct": False}
        )

    assert response.status_code == 200
    data = response.json()
    assert data["correct"]["IMAGE"] == 10
    assert data["correct"]["AUDIO"] == 7
    assert data["correct"]["VIDEO"] == 0
    assert data["correct"]["SIMULATION"] == 0
    assert data["incorrect"]["IMAGE"] == 10
    assert data["incorrect"]["AUDIO"] == 8
    assert data["incorrect"]["VIDEO"] == 0
    assert data["incorrect"]["SIMULATION"] == 0


@pytest.mark.asyncio
async def test_submit_correct_video():
    """Test submitting a correct VIDEO response."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/submit",
            json={"type": "VIDEO", "correct": True}
        )

    assert response.status_code == 200
    data = response.json()
    assert data["correct"]["IMAGE"] == 10
    assert data["correct"]["AUDIO"] == 7
    assert data["correct"]["VIDEO"] == 1
    assert data["correct"]["SIMULATION"] == 0
    assert data["incorrect"]["IMAGE"] == 10
    assert data["incorrect"]["AUDIO"] == 7
    assert data["incorrect"]["VIDEO"] == 0
    assert data["incorrect"]["SIMULATION"] == 0


@pytest.mark.asyncio
async def test_submit_incorrect_simulation():
    """Test submitting an incorrect SIMULATION response."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/submit",
            json={"type": "SIMULATION", "correct": False}
        )

    assert response.status_code == 200
    data = response.json()
    assert data["correct"]["IMAGE"] == 10
    assert data["correct"]["AUDIO"] == 7
    assert data["correct"]["VIDEO"] == 0
    assert data["correct"]["SIMULATION"] == 0
    assert data["incorrect"]["IMAGE"] == 10
    assert data["incorrect"]["AUDIO"] == 7
    assert data["incorrect"]["VIDEO"] == 0
    assert data["incorrect"]["SIMULATION"] == 1


@pytest.mark.asyncio
async def test_submit_multiple_requests():
    """Test submitting multiple requests and tracking statistics."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Submit correct IMAGE
        response1 = await client.post(
            "/submit",
            json={"type": "IMAGE", "correct": True}
        )
        assert response1.status_code == 200

        # Submit incorrect IMAGE
        response2 = await client.post(
            "/submit",
            json={"type": "IMAGE", "correct": False}
        )
        assert response2.status_code == 200

        # Submit correct AUDIO
        response3 = await client.post(
            "/submit",
            json={"type": "AUDIO", "correct": True}
        )
        assert response3.status_code == 200

        # Submit another correct IMAGE
        response4 = await client.post(
            "/submit",
            json={"type": "IMAGE", "correct": True}
        )
        assert response4.status_code == 200

        # Submit correct VIDEO
        response5 = await client.post(
            "/submit",
            json={"type": "VIDEO", "correct": True}
        )
        assert response5.status_code == 200

        # Submit incorrect SIMULATION
        response6 = await client.post(
            "/submit",
            json={"type": "SIMULATION", "correct": False}
        )
        assert response6.status_code == 200

    # Check final stats
    data = response6.json()
    assert data["correct"]["IMAGE"] == 12  # 10 initial + 2 submitted
    assert data["correct"]["AUDIO"] == 8   # 7 initial + 1 submitted
    assert data["correct"]["VIDEO"] == 1
    assert data["correct"]["SIMULATION"] == 0
    assert data["incorrect"]["IMAGE"] == 11  # 10 initial + 1 submitted
    assert data["incorrect"]["AUDIO"] == 7
    assert data["incorrect"]["VIDEO"] == 0
    assert data["incorrect"]["SIMULATION"] == 1


@pytest.mark.asyncio
async def test_submit_invalid_type():
    """Test submitting with invalid media type."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/submit",
            json={"type": "DOCUMENT", "correct": True}
        )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_submit_missing_fields():
    """Test submitting with missing fields."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Missing 'correct' field
        response1 = await client.post(
            "/submit",
            json={"type": "IMAGE"}
        )
        assert response1.status_code == 422

        # Missing 'type' field
        response2 = await client.post(
            "/submit",
            json={"correct": True}
        )
        assert response2.status_code == 422


@pytest.mark.asyncio
async def test_submit_lowercase_type():
    """Test that lowercase type values are rejected (expecting uppercase)."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/submit",
            json={"type": "image", "correct": True}
        )

    assert response.status_code == 422


@pytest.mark.asyncio
async def test_cors_headers():
    """Test that CORS headers are present in the response."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        response = await client.post(
            "/submit",
            json={"type": "IMAGE", "correct": True},
            headers={"Origin": "http://localhost:3000"}
        )

    assert response.status_code == 200
    assert "access-control-allow-origin" in response.headers
    assert response.headers["access-control-allow-origin"] == "*"
