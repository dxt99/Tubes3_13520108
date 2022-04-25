package main

import (
	"fmt"
	"regexp"
	"strings"
)

// Checks whether input is a DNA using regex
func IsDNA(DNA string) bool {
	regex, _ := regexp.Compile(`[GTCA]+`)
	return regex.MatchString(DNA)
}

// Seperates query into date and name
func querySplit(query string) (string, string) {
	date, _ := regexp.Compile(`\d{2}-\d{2}-\d{4}`)
	dateStr := date.FindStringSubmatch(query)
	fmt.Println(dateStr)
	nameStr := date.Split(query, -1)
	if len(nameStr) < 2 {
		return "", strings.TrimSpace(query)
	}
	return dateStr[0], strings.TrimSpace(nameStr[1])
}

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

// Checks whether pattern exists in target
// Uses boyer moore algorithm
func BoyerMoore(target string, pattern string) bool {

	n := len(target)
	m := len(pattern)

	// Preprocessing
	s := make([]int, 256) //ascii characters
	for i := range s {
		s[i] = -1
	}
	for i, val := range pattern {
		s[int(val)] = i
	}

	// String Matching
	for k := 0; k <= (n - m); {
		l := m - 1
		for l >= 0 && pattern[l] == target[k+l] {
			l--
		}
		if l >= 0 {
			shift := l - s[int(target[k+l])]
			if shift < 1 {
				shift = 1
			}
			k = k + shift
		} else {
			return true
		}
	}

	return false
}
