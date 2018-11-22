def schedule_util(array):
    teams = len(array)
    half_tour = teams - 1
    total_rounds = half_tour * 2
    matches_per_round = teams // 2
    rounds = []
    for rnd in range(total_rounds):
        matches = []
        for match in range(matches_per_round):
            home = (rnd + match) % (teams - 1)
            away = (teams - 1 - match + rnd) % (teams - 1)
            if match == 0:
                away = teams - 1
            if rnd >= half_tour:
                home, away = away, home
            matches.append([array[home], array[away]])
        rounds.append(matches)
    return rounds
