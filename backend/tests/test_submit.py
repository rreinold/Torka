import pytest
from httpx import AsyncClient, ASGITransport
from aitxhackathon.app import app, stats_store


@pytest.fixture(autouse=True)
def reset_stats():
    """Reset stats store before each test."""
    stats_store["correct"]["IMAGE"] = 1
    stats_store["correct"]["AUDIO"] = 1
    stats_store["correct"]["VIDEO"] = 1
    stats_store["correct"]["SIMULATION"] = 1
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
    assert data["correct"]["IMAGE"] == 2
    assert data["correct"]["AUDIO"] == 1
    assert data["correct"]["VIDEO"] == 1
    assert data["correct"]["SIMULATION"] == 1


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
    assert data["correct"]["IMAGE"] == 1
    assert data["correct"]["AUDIO"] == 0  # Decremented from 1
    assert data["correct"]["VIDEO"] == 1
    assert data["correct"]["SIMULATION"] == 1


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
    assert data["correct"]["IMAGE"] == 1
    assert data["correct"]["AUDIO"] == 1
    assert data["correct"]["VIDEO"] == 2  # Incremented from 1
    assert data["correct"]["SIMULATION"] == 1


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
    assert data["correct"]["IMAGE"] == 1
    assert data["correct"]["AUDIO"] == 1
    assert data["correct"]["VIDEO"] == 1
    assert data["correct"]["SIMULATION"] == 0  # Decremented from 1


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
    assert data["correct"]["IMAGE"] == 2  # 1 initial + 1 correct + 1 correct - 1 incorrect = 2
    assert data["correct"]["AUDIO"] == 2  # 1 initial + 1 correct = 2
    assert data["correct"]["VIDEO"] == 2  # 1 initial + 1 correct = 2
    assert data["correct"]["SIMULATION"] == 0  # 1 initial - 1 incorrect = 0


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


@pytest.mark.asyncio
async def test_decrement_never_goes_below_zero():
    """Test that decrementing counters never goes below 0."""
    transport = ASGITransport(app=app)
    async with AsyncClient(transport=transport, base_url="http://test") as client:
        # Submit incorrect IMAGE twice (starts at 1, should go to 0 and stay at 0)
        response1 = await client.post(
            "/submit",
            json={"type": "IMAGE", "correct": False}
        )
        assert response1.status_code == 200
        data1 = response1.json()
        assert data1["correct"]["IMAGE"] == 0

        # Submit incorrect IMAGE again - should stay at 0
        response2 = await client.post(
            "/submit",
            json={"type": "IMAGE", "correct": False}
        )
        assert response2.status_code == 200
        data2 = response2.json()
        assert data2["correct"]["IMAGE"] == 0  # Should not go negative
