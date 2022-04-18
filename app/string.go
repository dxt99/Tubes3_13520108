package main

// Checks longest subsequence of pattern in target,
// returns length of the subsequence divided by pattern length
func LCS(target string, pattern string) float64 {
	n := len(target)
	m := len(pattern)
	dp := make([][]int, n+2)
	for i := range dp {
		dp[i] = make([]int, m+2)
	}

	//memset dp table to 0
	for i := 0; i <= n; i++ {
		for j := 0; j <= m; j++ {
			dp[i][j] = 0
		}
	}

	// insert/delete cost: 0, mismatch: -1e6, match: 1
	// bottom up dp
	for i := 1; i <= n; i++ {
		for j := 1; j <= m; j++ {
			if target[i-1] == pattern[j-1] {
				dp[i][j] = dp[i-1][j-1] + 1
			} else {
				dp[i][j] = dp[i-1][j-1] - 1e6
			}
			if dp[i-1][j] > dp[i][j] {
				dp[i][j] = dp[i-1][j]
			}
			if dp[i][j-1] > dp[i][j] {
				dp[i][j] = dp[i][j-1]
			}
		}
	}

	return float64(dp[n][m]) / float64(m)
}
