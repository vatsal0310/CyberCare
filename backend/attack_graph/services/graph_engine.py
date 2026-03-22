from typing import List, Dict


def build_graph(assets: list, connections: list) -> Dict[str, List[str]]:
    """Build adjacency list from assets and connections."""
    graph = {str(asset.id): [] for asset in assets}

    for conn in connections:
        src = str(conn.source_id)
        tgt = str(conn.target_id)
        if src in graph:
            graph[src].append(tgt)

    return graph


def find_all_paths(graph: Dict, start: str, end: str, path: List = []) -> List[List[str]]:
    """DFS to find all paths from start node to end node."""
    path = path + [start]
    if start == end:
        return [path]
    if start not in graph:
        return []

    paths = []
    for node in graph[start]:
        if node not in path:
            new_paths = find_all_paths(graph, node, end, path)
            paths.extend(new_paths)

    return paths


def find_entry_points(assets: list) -> List[str]:
    """Return all public-facing asset IDs as attack entry points."""
    return [str(a.id) for a in assets if a.exposure == "public"]


def find_sensitive_targets(assets: list) -> List[str]:
    """Return all high/critical sensitivity asset IDs as targets."""
    return [str(a.id) for a in assets if a.sensitivity in ("high", "critical")]


def enumerate_attack_paths(assets: list, connections: list) -> List[List[str]]:
    """Find all attack paths from public assets to sensitive assets."""
    graph = build_graph(assets, connections)
    entry_points = find_entry_points(assets)
    targets = find_sensitive_targets(assets)

    all_paths = []
    for entry in entry_points:
        for target in targets:
            if entry != target:
                paths = find_all_paths(graph, entry, target)
                all_paths.extend(paths)

    return all_paths