FROM python:3.12

RUN pip install uv

WORKDIR /code

COPY ./pyproject.toml ./uv.lock /code/

RUN uv sync --frozen --no-dev

COPY ./aitxhackathon /code/aitxhackathon

EXPOSE 5000/tcp
HEALTHCHECK --interval=30s --timeout=3s \
  CMD curl -f http://localhost:5000/health || exit 1

CMD ["uv", "run", "uvicorn", "aitxhackathon.app:app", "--host", "0.0.0.0", "--port", "5000"]
