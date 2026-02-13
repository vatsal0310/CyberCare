import docker

client = docker.from_env()

CONTAINER_NAME = "xenodochial_yonath"  # ✅ must match docker ps

def exec_in_kali(command: list[str]) -> str:
    container = client.containers.get(CONTAINER_NAME)
    exec_log = container.exec_run(command)
    return exec_log.output.decode("utf-8")
