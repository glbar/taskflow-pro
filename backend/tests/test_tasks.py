def test_create_task_201(client):
    res = client.post("/api/tasks", json={"title": "테스트 태스크"})
    assert res.status_code == 201
    data = res.json()
    assert data["title"] == "테스트 태스크"
    assert data["status"] == "todo"
    assert "description" in data


def test_create_task_400_missing_title(client):
    res = client.post("/api/tasks", json={"status": "todo"})
    assert res.status_code == 400


def test_create_task_400_title_too_long(client):
    res = client.post("/api/tasks", json={"title": "a" * 201})
    assert res.status_code == 400


def test_create_task_400_invalid_status(client):
    res = client.post("/api/tasks", json={"title": "테스트", "status": "invalid"})
    assert res.status_code == 400


def test_list_tasks_200(client):
    client.post("/api/tasks", json={"title": "태스크 1"})
    client.post("/api/tasks", json={"title": "태스크 2"})
    res = client.get("/api/tasks")
    assert res.status_code == 200
    data = res.json()
    assert len(data) == 2
    # 목록에 description 미포함 확인
    assert "description" not in data[0]


def test_get_task_200_with_description(client):
    created = client.post(
        "/api/tasks", json={"title": "단건 태스크", "description": "상세 설명"}
    ).json()
    res = client.get(f"/api/tasks/{created['id']}")
    assert res.status_code == 200
    assert res.json()["description"] == "상세 설명"


def test_get_task_404(client):
    res = client.get("/api/tasks/9999")
    assert res.status_code == 404


def test_update_task_200_partial(client):
    created = client.post("/api/tasks", json={"title": "수정 전 제목"}).json()
    res = client.put(f"/api/tasks/{created['id']}", json={"status": "in_progress"})
    assert res.status_code == 200
    data = res.json()
    assert data["status"] == "in_progress"
    assert data["title"] == "수정 전 제목"  # 부분 수정 확인


def test_update_task_404(client):
    res = client.put("/api/tasks/9999", json={"status": "done"})
    assert res.status_code == 404


def test_delete_task_204(client):
    created = client.post("/api/tasks", json={"title": "삭제 태스크"}).json()
    res = client.delete(f"/api/tasks/{created['id']}")
    assert res.status_code == 204


def test_delete_task_404(client):
    res = client.delete("/api/tasks/9999")
    assert res.status_code == 404
