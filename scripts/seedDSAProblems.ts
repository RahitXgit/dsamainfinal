import { createClient } from '@supabase/supabase-js'
import * as fs from 'fs'
import * as path from 'path'
import { config } from 'dotenv'

// Load environment variables from .env.local
config({ path: '.env.local' })

// ============================================
// DSA Problems Seed Script
// Populates all 404 problems with LeetCode links
// ============================================

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Error: Missing environment variables!')
    console.error('Please ensure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set in .env.local')
    process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

// Helper function to generate LeetCode slug from problem title
function generateLeetCodeSlug(title: string): string {
    return title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '')
}

// Helper function to generate LeetCode URL
function generateLeetCodeUrl(title: string): string {
    const slug = generateLeetCodeSlug(title)
    return `https://leetcode.com/problems/${slug}/`
}

// All 404 problems organized by category and pattern
const dsaProblems = {
    "Two Pointer Patterns": {
        "Two Pointers - Converging (Sorted Array Target Sum)": [
            { title: "Container With Most Water", difficulty: "Medium" },
            { title: "3Sum", difficulty: "Medium" },
            { title: "3Sum Closest", difficulty: "Medium" },
            { title: "4Sum", difficulty: "Medium" },
            { title: "Two Sum II - Input Array Is Sorted", difficulty: "Easy" },
            { title: "Intersection of Two Arrays", difficulty: "Easy" },
            { title: "Boats to Save People", difficulty: "Medium" },
            { title: "Squares of a Sorted Array", difficulty: "Easy" },
            { title: "3Sum Smaller", difficulty: "Medium" }
        ],
        "Two Pointers - Fast & Slow (Cycle Detection)": [
            { title: "Linked List Cycle", difficulty: "Easy" },
            { title: "Happy Number", difficulty: "Easy" },
            { title: "Find the Duplicate Number", difficulty: "Medium" },
            { title: "Is Subsequence", difficulty: "Easy" }
        ],
        "Two Pointers - Fixed Separation (Nth Node from End)": [
            { title: "Remove Nth Node From End of List", difficulty: "Medium" },
            { title: "Middle of the Linked List", difficulty: "Easy" },
            { title: "Delete the Middle Node of a Linked List", difficulty: "Medium" }
        ],
        "Two Pointers - In-place Array Modification": [
            { title: "Remove Duplicates from Sorted Array", difficulty: "Easy" },
            { title: "Remove Element", difficulty: "Easy" },
            { title: "Sort Colors", difficulty: "Medium" },
            { title: "Remove Duplicates from Sorted Array II", difficulty: "Medium" },
            { title: "Move Zeroes", difficulty: "Easy" },
            { title: "String Compression", difficulty: "Medium" },
            { title: "Sort Array By Parity", difficulty: "Easy" },
            { title: "Move Pieces to Obtain a String", difficulty: "Medium" },
            { title: "Separate Black and White Balls", difficulty: "Medium" }
        ],
        "Two Pointers - String Comparison with Backspaces": [
            { title: "Backspace String Compare", difficulty: "Easy" },
            { title: "Crawler Log Folder", difficulty: "Easy" }
        ],
        "Two Pointers - Expanding From Center (Palindromes)": [
            { title: "Longest Palindromic Substring", difficulty: "Medium" },
            { title: "Palindromic Substrings", difficulty: "Medium" }
        ],
        "Two Pointers - String Reversal": [
            { title: "Reverse Words in a String", difficulty: "Medium" },
            { title: "Reverse String", difficulty: "Easy" },
            { title: "Reverse Vowels of a String", difficulty: "Easy" },
            { title: "Reverse String II", difficulty: "Easy" }
        ]
    },
    "Sliding Window Patterns": {
        "Sliding Window - Fixed Size (Subarray Calculation)": [
            { title: "Moving Average from Data Stream", difficulty: "Easy" },
            { title: "Maximum Average Subarray I", difficulty: "Easy" },
            { title: "Calculate Compressed Mean", difficulty: "Easy" },
            { title: "Find the Power of K-Size Subarrays I", difficulty: "Medium" },
            { title: "Find X-Sum of All K-Long Subarrays I", difficulty: "Easy" }
        ],
        "Sliding Window - Variable Size (Condition-Based)": [
            { title: "Longest Substring Without Repeating Characters", difficulty: "Medium" },
            { title: "Minimum Window Substring", difficulty: "Hard" },
            { title: "Minimum Size Subarray Sum", difficulty: "Medium" },
            { title: "Contains Duplicate II", difficulty: "Easy" },
            { title: "Longest Repeating Character Replacement", difficulty: "Medium" },
            { title: "Subarray Product Less Than K", difficulty: "Medium" },
            { title: "Fruit Into Baskets", difficulty: "Medium" },
            { title: "Max Consecutive Ones III", difficulty: "Medium" },
            { title: "Longest Continuous Subarray With Absolute Diff Less Than or Equal to Limit", difficulty: "Medium" },
            { title: "Longest Subarray of 1's After Deleting One Element", difficulty: "Medium" },
            { title: "Minimum Operations to Reduce X to Zero", difficulty: "Medium" },
            { title: "Frequency of the Most Frequent Element", difficulty: "Medium" },
            { title: "Maximum Sum of Distinct Subarrays With Length K", difficulty: "Medium" },
            { title: "Take K of Each Character From Left and Right", difficulty: "Medium" },
            { title: "Continuous Subarrays", difficulty: "Medium" },
            { title: "Maximum Beauty of an Array After Applying Operation", difficulty: "Medium" },
            { title: "Find Longest Special Substring That Occurs Thrice I", difficulty: "Medium" },
            { title: "Maximum Good Subarray Sum", difficulty: "Medium" },
            { title: "Maximum Frequency of an Element After Performing Operations I", difficulty: "Medium" },
            { title: "Maximum Frequency of an Element After Performing Operations II", difficulty: "Hard" }
        ],
        "Sliding Window - Monotonic Queue for Max/Min": [
            { title: "Sliding Window Maximum", difficulty: "Hard" },
            { title: "Shortest Subarray with Sum at Least K", difficulty: "Hard" },
            { title: "Jump Game VI", difficulty: "Medium" }
        ],
        "Sliding Window - Character Frequency Matching": [
            { title: "Find All Anagrams in a String", difficulty: "Medium" },
            { title: "Permutation in String", difficulty: "Medium" }
        ]
    },
    "Tree Traversal Patterns (DFS & BFS)": {
        "Tree BFS - Level Order Traversal": [
            { title: "Binary Tree Level Order Traversal", difficulty: "Medium" },
            { title: "Binary Tree Zigzag Level Order Traversal", difficulty: "Medium" },
            { title: "Binary Tree Right Side View", difficulty: "Medium" },
            { title: "Find Largest Value in Each Tree Row", difficulty: "Medium" },
            { title: "Maximum Level Sum of a Binary Tree", difficulty: "Medium" }
        ],
        "Tree DFS - Recursive Preorder Traversal": [
            { title: "Same Tree", difficulty: "Easy" },
            { title: "Symmetric Tree", difficulty: "Easy" },
            { title: "Construct Binary Tree from Preorder and Inorder Traversal", difficulty: "Medium" },
            { title: "Flatten Binary Tree to Linked List", difficulty: "Medium" },
            { title: "Invert Binary Tree", difficulty: "Easy" },
            { title: "Binary Tree Paths", difficulty: "Easy" },
            { title: "Smallest String Starting From Leaf", difficulty: "Medium" }
        ],
        "Tree DFS - Recursive Inorder Traversal": [
            { title: "Binary Tree Inorder Traversal", difficulty: "Easy" },
            { title: "Validate Binary Search Tree", difficulty: "Medium" },
            { title: "Binary Search Tree Iterator", difficulty: "Medium" },
            { title: "Kth Smallest Element in a BST", difficulty: "Medium" },
            { title: "Find Mode in Binary Search Tree", difficulty: "Easy" },
            { title: "Minimum Absolute Difference in BST", difficulty: "Easy" }
        ],
        "Tree DFS - Recursive Postorder Traversal": [
            { title: "Maximum Depth of Binary Tree", difficulty: "Easy" },
            { title: "Balanced Binary Tree", difficulty: "Easy" },
            { title: "Binary Tree Maximum Path Sum", difficulty: "Hard" },
            { title: "Binary Tree Postorder Traversal", difficulty: "Easy" },
            { title: "House Robber III", difficulty: "Medium" },
            { title: "Find Leaves of Binary Tree", difficulty: "Medium" },
            { title: "Diameter of Binary Tree", difficulty: "Easy" },
            { title: "All Nodes Distance K in Binary Tree", difficulty: "Medium" },
            { title: "Delete Nodes And Return Forest", difficulty: "Medium" },
            { title: "Height of Binary Tree After Subtree Removal Queries", difficulty: "Hard" }
        ],
        "Tree - Lowest Common Ancestor (LCA) Finding": [
            { title: "Lowest Common Ancestor of a Binary Search Tree", difficulty: "Medium" },
            { title: "Lowest Common Ancestor of a Binary Tree", difficulty: "Medium" }
        ],
        "Tree - Serialization and Deserialization": [
            { title: "Serialize and Deserialize Binary Tree", difficulty: "Hard" },
            { title: "Subtree of Another Tree", difficulty: "Easy" },
            { title: "Find Duplicate Subtrees", difficulty: "Medium" }
        ]
    },
    "Graph Traversal Patterns (DFS & BFS)": {
        "Graph DFS - Connected Components / Island Counting": [
            { title: "Surrounded Regions", difficulty: "Medium" },
            { title: "Number of Islands", difficulty: "Medium" },
            { title: "Pacific Atlantic Water Flow", difficulty: "Medium" },
            { title: "Number of Provinces", difficulty: "Medium" },
            { title: "Max Area of Island", difficulty: "Medium" },
            { title: "Flood Fill", difficulty: "Easy" },
            { title: "Keys and Rooms", difficulty: "Medium" },
            { title: "Number of Enclaves", difficulty: "Medium" },
            { title: "Number of Closed Islands", difficulty: "Medium" },
            { title: "Count Sub Islands", difficulty: "Medium" },
            { title: "Detonate the Maximum Bombs", difficulty: "Medium" }
        ],
        "Graph BFS - Connected Components / Island Counting": [
            { title: "01 Matrix", difficulty: "Medium" },
            { title: "Rotting Oranges", difficulty: "Medium" },
            { title: "Shortest Path in Binary Matrix", difficulty: "Medium" }
        ],
        "Graph DFS - Cycle Detection (Directed Graph)": [
            { title: "Course Schedule", difficulty: "Medium" },
            { title: "Course Schedule II", difficulty: "Medium" },
            { title: "Find Eventual Safe States", difficulty: "Medium" },
            { title: "All Paths from Source Lead to Destination", difficulty: "Medium" }
        ],
        "Graph BFS - Topological Sort (Kahn's Algorithm)": [
            { title: "Course Schedule", difficulty: "Medium" },
            { title: "Course Schedule II", difficulty: "Medium" },
            { title: "Alien Dictionary", difficulty: "Hard" },
            { title: "Minimum Height Trees", difficulty: "Medium" },
            { title: "Sequence Reconstruction", difficulty: "Medium" },
            { title: "Parallel Courses", difficulty: "Medium" },
            { title: "Largest Color Value in a Directed Graph", difficulty: "Hard" },
            { title: "Parallel Courses III", difficulty: "Hard" },
            { title: "Find All Possible Recipes from Given Supplies", difficulty: "Medium" },
            { title: "Build a Matrix With Conditions", difficulty: "Hard" }
        ],
        "Graph - Deep Copy / Cloning": [
            { title: "Clone Graph", difficulty: "Medium" },
            { title: "Find the City With the Smallest Number of Neighbors at a Threshold Distance", difficulty: "Medium" },
            { title: "Copy List with Random Pointer", difficulty: "Medium" },
            { title: "Clone N-ary Tree", difficulty: "Medium" }
        ],
        "Graph - Shortest Path (Dijkstra's Algorithm)": [
            { title: "Network Delay Time", difficulty: "Medium" },
            { title: "Swim in Rising Water", difficulty: "Hard" },
            { title: "Path with Maximum Probability", difficulty: "Medium" },
            { title: "Path With Minimum Effort", difficulty: "Medium" },
            { title: "Number of Ways to Arrive at Destination", difficulty: "Medium" },
            { title: "Second Minimum Time to Reach Destination", difficulty: "Hard" },
            { title: "Minimum Weighted Subgraph With the Required Paths", difficulty: "Hard" },
            { title: "Minimum Obstacle Removal to Reach Corner", difficulty: "Hard" },
            { title: "Minimum Time to Visit a Cell In a Grid", difficulty: "Hard" },
            { title: "Find the Safest Path in a Grid", difficulty: "Medium" }
        ],
        "Graph - Shortest Path (Bellman-Ford / BFS+K)": [
            { title: "Cheapest Flights Within K Stops", difficulty: "Medium" },
            { title: "Shortest Path with Alternating Colors", difficulty: "Medium" }
        ],
        "Graph - Union-Find (Disjoint Set Union - DSU)": [
            { title: "Number of Islands", difficulty: "Medium" },
            { title: "Graph Valid Tree", difficulty: "Medium" },
            { title: "Number of Islands II", difficulty: "Hard" },
            { title: "Number of Connected Components in an Undirected Graph", difficulty: "Medium" },
            { title: "Number of Provinces", difficulty: "Medium" },
            { title: "Redundant Connection", difficulty: "Medium" },
            { title: "Accounts Merge", difficulty: "Medium" },
            { title: "Sentence Similarity II", difficulty: "Medium" },
            { title: "Most Stones Removed with Same Row or Column", difficulty: "Medium" },
            { title: "Largest Component Size by Common Factor", difficulty: "Hard" },
            { title: "Regions Cut By Slashes", difficulty: "Medium" },
            { title: "The Earliest Moment When Everyone Become Friends", difficulty: "Medium" }
        ],
        "Graph - Bridges & Articulation Points (Tarjan low-link)": [
            { title: "Critical Connections in a Network", difficulty: "Hard" },
            { title: "Find Critical and Pseudo-Critical Edges in Minimum Spanning Tree", difficulty: "Hard" }
        ],
        "Graph - Minimum Spanning Tree (Kruskal / Prim / DSU + heap)": [
            { title: "Connecting Cities With Minimum Cost", difficulty: "Medium" },
            { title: "Min Cost to Connect All Points", difficulty: "Medium" },
            { title: "Optimize Water Distribution in a Village", difficulty: "Hard" }
        ],
        "Graph - Bidirectional BFS (BFS optimization for known source & target)": [
            { title: "Word Ladder II", difficulty: "Hard" },
            { title: "Bus Routes", difficulty: "Hard" }
        ]
    },
    "Dynamic Programming (DP) Patterns": {
        "DP - 1D Array (Fibonacci Style)": [
            { title: "Climbing Stairs", difficulty: "Easy" },
            { title: "Decode Ways", difficulty: "Medium" },
            { title: "House Robber", difficulty: "Medium" },
            { title: "House Robber II", difficulty: "Medium" },
            { title: "House Robber III", difficulty: "Medium" },
            { title: "Fibonacci Number", difficulty: "Easy" },
            { title: "Delete and Earn", difficulty: "Medium" },
            { title: "Min Cost Climbing Stairs", difficulty: "Easy" }
        ],
        "DP - 1D Array (Kadane's Algorithm for Max/Min Subarray)": [
            { title: "Maximum Subarray", difficulty: "Medium" },
            { title: "Maximum Sum Circular Subarray", difficulty: "Medium" },
            { title: "Maximum Absolute Sum of Any Subarray", difficulty: "Medium" },
            { title: "Maximum Product Subarray", difficulty: "Medium" }
        ],
        "DP - 1D Array (Coin Change / Unbounded Knapsack Style)": [
            { title: "Coin Change", difficulty: "Medium" },
            { title: "Combination Sum IV", difficulty: "Medium" },
            { title: "Coin Change II", difficulty: "Medium" }
        ],
        "DP - 1D Array (0/1 Knapsack Subset Sum Style)": [
            { title: "Partition Equal Subset Sum", difficulty: "Medium" },
            { title: "Target Sum", difficulty: "Medium" }
        ],
        "DP - 1D Array (Word Break Style)": [
            { title: "Word Break", difficulty: "Medium" },
            { title: "Word Break II", difficulty: "Hard" }
        ],
        "DP - 2D Array (Longest Common Subsequence - LCS)": [
            { title: "Longest Common Subsequence", difficulty: "Medium" },
            { title: "Shortest Common Supersequence", difficulty: "Hard" },
            { title: "Minimum Insertion Steps to Make a String Palindrome", difficulty: "Hard" }
        ],
        "DP - 2D Array (Edit Distance / Levenshtein Distance)": [
            { title: "Edit Distance", difficulty: "Medium" },
            { title: "Delete Operation for Two Strings", difficulty: "Medium" },
            { title: "Minimum ASCII Delete Sum for Two Strings", difficulty: "Medium" }
        ],
        "DP - 2D Array (Unique Paths on Grid)": [
            { title: "Unique Paths", difficulty: "Medium" },
            { title: "Unique Paths II", difficulty: "Medium" },
            { title: "Minimum Path Sum", difficulty: "Medium" },
            { title: "Triangle", difficulty: "Medium" },
            { title: "Maximal Square", difficulty: "Medium" },
            { title: "Minimum Falling Path Sum", difficulty: "Medium" },
            { title: "Count Square Submatrices with All Ones", difficulty: "Medium" }
        ],
        "DP - Interval DP": [
            { title: "Burst Balloons", difficulty: "Hard" },
            { title: "Remove Boxes", difficulty: "Hard" }
        ],
        "DP - Catalan Numbers": [
            { title: "Unique Binary Search Trees II", difficulty: "Medium" },
            { title: "Unique Binary Search Trees", difficulty: "Medium" },
            { title: "Different Ways to Add Parentheses", difficulty: "Medium" }
        ],
        "DP - Longest Increasing Subsequence (LIS)": [
            { title: "Longest Increasing Subsequence", difficulty: "Medium" },
            { title: "Russian Doll Envelopes", difficulty: "Hard" },
            { title: "Minimum Number of Removals to Make Mountain Array", difficulty: "Hard" },
            { title: "Longest Increasing Subsequence II", difficulty: "Hard" }
        ],
        "DP - Stock problems": [
            { title: "Best Time to Buy and Sell Stock", difficulty: "Easy" },
            { title: "Best Time to Buy and Sell Stock II", difficulty: "Medium" },
            { title: "Best Time to Buy and Sell Stock III", difficulty: "Hard" },
            { title: "Best Time to Buy and Sell Stock IV", difficulty: "Hard" },
            { title: "Best Time to Buy and Sell Stock with Cooldown", difficulty: "Medium" }
        ]
    },
    "Heap (Priority Queue) Patterns": {
        "Heap - Top K Elements (Selection/Frequency)": [
            { title: "Kth Largest Element in an Array", difficulty: "Medium" },
            { title: "Top K Frequent Elements", difficulty: "Medium" },
            { title: "Sort Characters By Frequency", difficulty: "Medium" },
            { title: "Relative Ranks", difficulty: "Easy" },
            { title: "Kth Largest Element in a Stream", difficulty: "Easy" },
            { title: "K Closest Points to Origin", difficulty: "Medium" },
            { title: "Last Stone Weight", difficulty: "Easy" },
            { title: "Take Gifts From the Richest Pile", difficulty: "Easy" }
        ],
        "Heap - Two Heaps for Median Finding": [
            { title: "Find Median from Data Stream", difficulty: "Hard" },
            { title: "Finding MK Average", difficulty: "Hard" }
        ],
        "Heap - K-way Merge": [
            { title: "Merge k Sorted Lists", difficulty: "Hard" },
            { title: "Find K Pairs with Smallest Sums", difficulty: "Medium" },
            { title: "Kth Smallest Element in a Sorted Matrix", difficulty: "Medium" },
            { title: "Smallest Range Covering Elements from K Lists", difficulty: "Hard" }
        ],
        "Heap - Scheduling / Minimum Cost (Greedy with Priority Queue)": [
            { title: "Meeting Rooms II", difficulty: "Medium" },
            { title: "Reorganize String", difficulty: "Medium" },
            { title: "Minimum Cost to Hire K Workers", difficulty: "Hard" },
            { title: "Furthest Building You Can Reach", difficulty: "Medium" },
            { title: "Maximum Average Pass Ratio", difficulty: "Medium" },
            { title: "Single-Threaded CPU", difficulty: "Medium" },
            { title: "The Number of the Smallest Unoccupied Chair", difficulty: "Medium" },
            { title: "Meeting Rooms III", difficulty: "Hard" }
        ]
    },
    "Backtracking Patterns": {
        "Backtracking - Subsets (Include/Exclude)": [
            { title: "Letter Combinations of a Phone Number", difficulty: "Medium" },
            { title: "Combinations", difficulty: "Medium" },
            { title: "Subsets", difficulty: "Medium" },
            { title: "Subsets II", difficulty: "Medium" }
        ],
        "Backtracking - Permutations": [
            { title: "Next Permutation", difficulty: "Medium" },
            { title: "Permutations", difficulty: "Medium" },
            { title: "Permutation Sequence", difficulty: "Hard" }
        ],
        "Backtracking - Combination Sum": [
            { title: "Combination Sum", difficulty: "Medium" },
            { title: "Combination Sum II", difficulty: "Medium" }
        ],
        "Backtracking - Parentheses Generation": [
            { title: "Generate Parentheses", difficulty: "Medium" },
            { title: "Remove Invalid Parentheses", difficulty: "Hard" }
        ],
        "Backtracking - Word Search / Path Finding in Grid": [
            { title: "Word Search", difficulty: "Medium" },
            { title: "Word Search II", difficulty: "Hard" },
            { title: "Check if Word Can Be Placed In Crossword", difficulty: "Medium" }
        ],
        "Backtracking - N-Queens / Constraint Satisfaction": [
            { title: "Sudoku Solver", difficulty: "Hard" },
            { title: "N-Queens", difficulty: "Hard" }
        ],
        "Backtracking - Palindrome Partitioning": [
            { title: "Palindrome Partitioning", difficulty: "Medium" },
            { title: "Palindrome Partitioning II", difficulty: "Hard" },
            { title: "Pseudo-Palindromic Paths in a Binary Tree", difficulty: "Medium" }
        ]
    },
    "Greedy Patterns": {
        "Greedy - Interval Merging/Scheduling": [
            { title: "Merge Intervals", difficulty: "Medium" },
            { title: "Insert Interval", difficulty: "Medium" },
            { title: "Employee Free Time", difficulty: "Hard" },
            { title: "Interval List Intersections", difficulty: "Medium" },
            { title: "Divide Intervals Into Minimum Number of Groups", difficulty: "Medium" }
        ],
        "Greedy - Jump Game Reachability/Minimization": [
            { title: "Jump Game II", difficulty: "Medium" },
            { title: "Jump Game", difficulty: "Medium" }
        ],
        "Greedy - Buy/Sell Stock": [
            { title: "Best Time to Buy and Sell Stock", difficulty: "Easy" },
            { title: "Best Time to Buy and Sell Stock II", difficulty: "Medium" }
        ],
        "Greedy - Gas Station Circuit": [
            { title: "Gas Station", difficulty: "Medium" }
        ],
        "Greedy - Task Scheduling (Frequency Based)": [
            { title: "Task Scheduler", difficulty: "Medium" },
            { title: "Reorganize String", difficulty: "Medium" },
            { title: "Distant Barcodes", difficulty: "Medium" }
        ],
        "Greedy - Sorting Based": [
            { title: "Assign Cookies", difficulty: "Easy" },
            { title: "Candy", difficulty: "Hard" },
            { title: "Queue Reconstruction by Height", difficulty: "Medium" },
            { title: "Two City Scheduling", difficulty: "Medium" }
        ]
    },
    "Binary Search Patterns": {
        "Binary Search - On Sorted Array/List": [
            { title: "Search Insert Position", difficulty: "Easy" },
            { title: "Sqrt(x)", difficulty: "Easy" },
            { title: "Search a 2D Matrix", difficulty: "Medium" },
            { title: "First Bad Version", difficulty: "Easy" },
            { title: "Guess Number Higher or Lower", difficulty: "Easy" },
            { title: "Single Element in a Sorted Array", difficulty: "Medium" },
            { title: "Binary Search", difficulty: "Easy" },
            { title: "Kth Missing Positive Number", difficulty: "Easy" }
        ],
        "Binary Search - Find Min/Max in Rotated Sorted Array": [
            { title: "Search in Rotated Sorted Array", difficulty: "Medium" },
            { title: "Search in Rotated Sorted Array II", difficulty: "Medium" },
            { title: "Find Minimum in Rotated Sorted Array", difficulty: "Medium" },
            { title: "Find Peak Element", difficulty: "Medium" },
            { title: "Peak Index in a Mountain Array", difficulty: "Medium" },
            { title: "Find in Mountain Array", difficulty: "Hard" }
        ],
        "Binary Search - On Answer / Condition Function": [
            { title: "Split Array Largest Sum", difficulty: "Hard" },
            { title: "Minimize Max Distance to Gas Station", difficulty: "Hard" },
            { title: "Koko Eating Bananas", difficulty: "Medium" },
            { title: "Capacity To Ship Packages Within D Days", difficulty: "Medium" },
            { title: "Minimum Number of Days to Make m Bouquets", difficulty: "Medium" },
            { title: "Minimum Limit of Balls in a Bag", difficulty: "Medium" },
            { title: "Minimized Maximum of Products Distributed to Any Store", difficulty: "Medium" },
            { title: "Maximum Candies Allocated to K Children", difficulty: "Medium" }
        ],
        "Binary Search - Find First/Last Occurrence": [
            { title: "Find First and Last Position of Element in Sorted Array", difficulty: "Medium" },
            { title: "Find K Closest Elements", difficulty: "Medium" }
        ],
        "Binary Search - Median and Kth of Two Sorted Arrays": [
            { title: "Median of Two Sorted Arrays", difficulty: "Hard" },
            { title: "Find K-th Smallest Pair Distance", difficulty: "Hard" },
            { title: "Kth Smallest Element in a Sorted Matrix", difficulty: "Medium" }
        ]
    },
    "Stack Patterns": {
        "Stack - Valid Parentheses Matching": [
            { title: "Valid Parentheses", difficulty: "Easy" },
            { title: "Longest Valid Parentheses", difficulty: "Hard" },
            { title: "Minimum Add to Make Parentheses Valid", difficulty: "Medium" },
            { title: "Minimum Remove to Make Valid Parentheses", difficulty: "Medium" },
            { title: "Minimum Number of Swaps to Make the String Balanced", difficulty: "Medium" }
        ],
        "Stack - Monotonic Stack": [
            { title: "Remove K Digits", difficulty: "Medium" },
            { title: "Next Greater Element I", difficulty: "Easy" },
            { title: "Next Greater Element II", difficulty: "Medium" },
            { title: "Daily Temperatures", difficulty: "Medium" },
            { title: "Online Stock Span", difficulty: "Medium" },
            { title: "Sum of Subarray Minimums", difficulty: "Medium" },
            { title: "Maximum Width Ramp", difficulty: "Medium" },
            { title: "Final Prices With a Special Discount in a Shop", difficulty: "Easy" },
            { title: "Find the Most Competitive Subsequence", difficulty: "Medium" }
        ],
        "Stack - Expression Evaluation (RPN/Infix)": [
            { title: "Evaluate Reverse Polish Notation", difficulty: "Medium" },
            { title: "Basic Calculator", difficulty: "Hard" },
            { title: "Basic Calculator II", difficulty: "Medium" },
            { title: "Basic Calculator III", difficulty: "Hard" }
        ],
        "Stack - Simulation / Backtracking Helper": [
            { title: "Simplify Path", difficulty: "Medium" },
            { title: "Decode String", difficulty: "Medium" },
            { title: "Asteroid Collision", difficulty: "Medium" }
        ],
        "Stack - Min Stack Design": [
            { title: "Min Stack", difficulty: "Medium" },
            { title: "Maximum Frequency Stack", difficulty: "Hard" },
            { title: "Online Stock Span", difficulty: "Medium" }
        ],
        "Stack - Largest Rectangle in Histogram": [
            { title: "Largest Rectangle in Histogram", difficulty: "Hard" },
            { title: "Maximal Rectangle", difficulty: "Hard" }
        ]
    },
    "Bit Manipulation Patterns": {
        "Bitwise XOR - Finding Single/Missing Number": [
            { title: "Single Number", difficulty: "Easy" },
            { title: "Single Number II", difficulty: "Medium" },
            { title: "Missing Number", difficulty: "Easy" },
            { title: "Find the Difference", difficulty: "Easy" }
        ],
        "Bitwise AND - Counting Set Bits (Hamming Weight)": [
            { title: "Number of 1 Bits", difficulty: "Easy" },
            { title: "Power of Two", difficulty: "Easy" }
        ],
        "Bitwise DP - Counting Bits Optimization": [
            { title: "Counting Bits", difficulty: "Easy" },
            { title: "Parallel Courses", difficulty: "Medium" }
        ],
        "Bitwise Operations - Power of Two/Four Check": [
            { title: "Power of Two", difficulty: "Easy" },
            { title: "Power of Four", difficulty: "Easy" }
        ]
    },
    "Linked List Manipulation Patterns": {
        "Linked List - In-place Reversal": [
            { title: "Remove Duplicates from Sorted List", difficulty: "Easy" },
            { title: "Reverse Linked List II", difficulty: "Medium" },
            { title: "Reverse Linked List", difficulty: "Easy" },
            { title: "Reverse Nodes in k-Group", difficulty: "Hard" },
            { title: "Palindrome Linked List", difficulty: "Easy" },
            { title: "Remove Duplicates from Sorted List II", difficulty: "Medium" }
        ],
        "Linked List - Merging Two Sorted Lists": [
            { title: "Merge Two Sorted Lists", difficulty: "Easy" },
            { title: "Merge k Sorted Lists", difficulty: "Hard" }
        ],
        "Linked List - Addition of Numbers": [
            { title: "Add Two Numbers", difficulty: "Medium" },
            { title: "Plus One Linked List", difficulty: "Medium" }
        ],
        "Linked List - Intersection Detection": [
            { title: "Intersection of Two Linked Lists", difficulty: "Easy" },
            { title: "Minimum Index Sum of Two Lists", difficulty: "Easy" }
        ],
        "Linked List - Reordering / Partitioning": [
            { title: "Swap Nodes in Pairs", difficulty: "Medium" },
            { title: "Rotate List", difficulty: "Medium" },
            { title: "Partition List", difficulty: "Medium" },
            { title: "Reorder List", difficulty: "Medium" },
            { title: "Odd Even Linked List", difficulty: "Medium" }
        ]
    },
    "Array/Matrix Manipulation Patterns": {
        "Array/Matrix - In-place Rotation": [
            { title: "Rotate Image", difficulty: "Medium" },
            { title: "Rotate Array", difficulty: "Medium" },
            { title: "Transpose Matrix", difficulty: "Easy" }
        ],
        "Array/Matrix - Spiral Traversal": [
            { title: "Spiral Matrix", difficulty: "Medium" },
            { title: "Spiral Matrix II", difficulty: "Medium" },
            { title: "Spiral Matrix III", difficulty: "Medium" },
            { title: "Spiral Matrix IV", difficulty: "Medium" }
        ],
        "Array/Matrix - Set Matrix Zeroes (In-place Marking)": [
            { title: "Set Matrix Zeroes", difficulty: "Medium" },
            { title: "Game of Life", difficulty: "Medium" },
            { title: "Diagonal Traverse", difficulty: "Medium" }
        ],
        "Array - Product Except Self (Prefix/Suffix Products)": [
            { title: "Product of Array Except Self", difficulty: "Medium" },
            { title: "Longest Mountain in Array", difficulty: "Medium" }
        ],
        "Array - Plus One (Handling Carry)": [
            { title: "Plus One", difficulty: "Easy" },
            { title: "Multiply Strings", difficulty: "Medium" },
            { title: "Add to Array-Form of Integer", difficulty: "Easy" },
            { title: "Add Binary", difficulty: "Easy" }
        ],
        "Array - Merge Sorted Array (In-place from End)": [
            { title: "Merge Sorted Array", difficulty: "Easy" },
            { title: "Squares of a Sorted Array", difficulty: "Easy" }
        ],
        "Array - Cyclic Sort": [
            { title: "First Missing Positive", difficulty: "Hard" },
            { title: "Missing Number", difficulty: "Easy" },
            { title: "Find the Duplicate Number", difficulty: "Medium" },
            { title: "Find All Duplicates in an Array", difficulty: "Medium" },
            { title: "Find All Numbers Disappeared in an Array", difficulty: "Easy" }
        ]
    },
    "String Manipulation Patterns": {
        "String - Palindrome Check (Two Pointers / Reverse)": [
            { title: "Palindrome Number", difficulty: "Easy" },
            { title: "Valid Palindrome", difficulty: "Easy" },
            { title: "Valid Palindrome II", difficulty: "Easy" }
        ],
        "String - Anagram Check (Frequency Count/Sort)": [
            { title: "Group Anagrams", difficulty: "Medium" },
            { title: "Valid Anagram", difficulty: "Easy" }
        ],
        "String - Roman to Integer Conversion / String to Integer (atoi)": [
            { title: "Roman to Integer", difficulty: "Easy" },
            { title: "Integer to Roman", difficulty: "Medium" },
            { title: "String to Integer (atoi)", difficulty: "Medium" }
        ],
        "String - Multiply Strings/Add Strings (Manual Simulation)": [
            { title: "Multiply Strings", difficulty: "Medium" },
            { title: "Add Strings", difficulty: "Easy" },
            { title: "Add Binary", difficulty: "Easy" }
        ],
        "String Matching - Naive / KMP / Rabin-Karp": [
            { title: "Find the Index of the First Occurrence in a String", difficulty: "Easy" },
            { title: "Shortest Palindrome", difficulty: "Hard" },
            { title: "Repeated String Match", difficulty: "Medium" },
            { title: "Rotate String", difficulty: "Easy" },
            { title: "Find Beautiful Indices in the Given Array II", difficulty: "Hard" }
        ],
        "String - Repeated Substring Pattern Detection": [
            { title: "Repeated Substring Pattern", difficulty: "Easy" },
            { title: "Find the Index of the First Occurrence in a String", difficulty: "Easy" },
            { title: "Repeated String Match", difficulty: "Medium" }
        ]
    },
    "Design Patterns": {
        "Design (General/Specific)": [
            { title: "LRU Cache", difficulty: "Medium" },
            { title: "Min Stack", difficulty: "Medium" },
            { title: "Implement Stack using Queues", difficulty: "Easy" },
            { title: "Implement Queue using Stacks", difficulty: "Easy" },
            { title: "Flatten 2D Vector", difficulty: "Medium" },
            { title: "Encode and Decode Strings", difficulty: "Medium" },
            { title: "Find Median from Data Stream", difficulty: "Hard" },
            { title: "Flatten Nested List Iterator", difficulty: "Medium" },
            { title: "Moving Average from Data Stream", difficulty: "Easy" },
            { title: "Design Snake Game", difficulty: "Medium" },
            { title: "Logger Rate Limiter", difficulty: "Easy" },
            { title: "Design Hit Counter", difficulty: "Medium" },
            { title: "Design Phone Directory", difficulty: "Medium" },
            { title: "Insert Delete GetRandom O(1)", difficulty: "Medium" },
            { title: "All O`one Data Structure", difficulty: "Hard" },
            { title: "LFU Cache", difficulty: "Hard" },
            { title: "Design Compressed String Iterator", difficulty: "Easy" },
            { title: "Design Circular Queue", difficulty: "Medium" },
            { title: "Design Circular Deque", difficulty: "Medium" },
            { title: "Design Search Autocomplete System", difficulty: "Hard" },
            { title: "Design HashMap", difficulty: "Easy" },
            { title: "Range Module", difficulty: "Hard" },
            { title: "RLE Iterator", difficulty: "Medium" },
            { title: "Time Based Key-Value Store", difficulty: "Medium" },
            { title: "Snapshot Array", difficulty: "Medium" },
            { title: "Tweet Counts Per Frequency", difficulty: "Medium" },
            { title: "Product of the Last K Numbers", difficulty: "Medium" },
            { title: "Design a Stack With Increment Operation", difficulty: "Medium" },
            { title: "Design Most Recently Used Queue", difficulty: "Medium" },
            { title: "Detect Squares", difficulty: "Medium" },
            { title: "Stock Price Fluctuation", difficulty: "Medium" },
            { title: "Design a Text Editor", difficulty: "Hard" },
            { title: "Smallest Number in Infinite Set", difficulty: "Medium" }
        ],
        "Tries": [
            { title: "Implement Trie (Prefix Tree)", difficulty: "Medium" },
            { title: "Design Add and Search Words Data Structure", difficulty: "Medium" },
            { title: "Longest Word in Dictionary", difficulty: "Medium" },
            { title: "Replace Words", difficulty: "Medium" },
            { title: "Word Squares", difficulty: "Hard" },
            { title: "Design Search Autocomplete System", difficulty: "Hard" },
            { title: "Prefix and Suffix Search", difficulty: "Hard" }
        ]
    }
}

async function seedProblems() {
    console.log('🌱 Starting DSA Problems Seed...')

    let totalProblems = 0
    let successCount = 0
    let errorCount = 0

    for (const [categoryName, patterns] of Object.entries(dsaProblems)) {
        console.log(`\n📂 Category: ${categoryName}`)

        // Get category ID
        const { data: category, error: catError } = await supabase
            .from('dsa_categories')
            .select('id')
            .eq('name', categoryName)
            .single()

        if (catError || !category) {
            console.error(`❌ Category not found: ${categoryName}`)
            continue
        }

        for (const [patternName, problems] of Object.entries(patterns)) {
            console.log(`  📋 Pattern: ${patternName} (${problems.length} problems)`)

            // Get pattern ID
            const { data: pattern, error: patError } = await supabase
                .from('dsa_patterns')
                .select('id')
                .eq('category_id', category.id)
                .eq('name', patternName)
                .single()

            if (patError || !pattern) {
                console.error(`  ❌ Pattern not found: ${patternName}`)
                continue
            }

            // Insert problems
            for (let i = 0; i < problems.length; i++) {
                const problem = problems[i]
                totalProblems++

                const leetcodeUrl = generateLeetCodeUrl(problem.title)
                const leetcodeSlug = generateLeetCodeSlug(problem.title)

                const { error: probError } = await supabase
                    .from('dsa_problems')
                    .insert({
                        pattern_id: pattern.id,
                        title: problem.title,
                        display_order: i + 1,
                        difficulty: problem.difficulty,
                        leetcode_url: leetcodeUrl,
                        leetcode_slug: leetcodeSlug,
                        primary_platform: 'LeetCode'
                    })

                if (probError) {
                    console.error(`    ❌ Error inserting: ${problem.title}`)
                    console.error(`       ${probError.message}`)
                    errorCount++
                } else {
                    successCount++
                    if (successCount % 50 === 0) {
                        console.log(`    ✅ Inserted ${successCount} problems so far...`)
                    }
                }
            }
        }
    }

    console.log('\n' + '='.repeat(50))
    console.log('🎉 Seed Complete!')
    console.log(`📊 Total Problems: ${totalProblems}`)
    console.log(`✅ Successfully Inserted: ${successCount}`)
    console.log(`❌ Errors: ${errorCount}`)
    console.log('='.repeat(50))
}

// Run the seed
seedProblems()
    .then(() => {
        console.log('\n✨ All done!')
        process.exit(0)
    })
    .catch((error) => {
        console.error('\n💥 Fatal error:', error)
        process.exit(1)
    })
