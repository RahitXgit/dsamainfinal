-- ============================================
-- DSA Patterns Seed Data
-- Populates categories, patterns, and all 404 problems
-- ============================================

-- ============================================
-- STEP 1: Insert Categories (15 total)
-- ============================================

INSERT INTO dsa_categories (name, display_order, description, icon) VALUES
('Two Pointer Patterns', 1, 'Techniques using two pointers to traverse arrays or linked lists', '👆'),
('Sliding Window Patterns', 2, 'Fixed or variable size window techniques for subarray problems', '🪟'),
('Tree Traversal Patterns (DFS & BFS)', 3, 'Depth-first and breadth-first tree traversal techniques', '🌳'),
('Graph Traversal Patterns (DFS & BFS)', 4, 'Graph algorithms including DFS, BFS, and shortest path', '🕸️'),
('Dynamic Programming (DP) Patterns', 5, 'Optimization problems using memoization and tabulation', '📊'),
('Heap (Priority Queue) Patterns', 6, 'Priority queue based algorithms for top K and scheduling', '⛰️'),
('Backtracking Patterns', 7, 'Exhaustive search with constraint satisfaction', '🔙'),
('Greedy Patterns', 8, 'Locally optimal choices leading to global optimum', '🎯'),
('Binary Search Patterns', 9, 'Divide and conquer search techniques', '🔍'),
('Stack Patterns', 10, 'LIFO data structure for expression evaluation and monotonic problems', '📚'),
('Bit Manipulation Patterns', 11, 'Bitwise operations for optimization', '💾'),
('Linked List Manipulation Patterns', 12, 'In-place manipulation and traversal of linked lists', '🔗'),
('Array/Matrix Manipulation Patterns', 13, 'In-place array operations and matrix traversal', '📐'),
('String Manipulation Patterns', 14, 'String algorithms including pattern matching', '📝'),
('Design Patterns', 15, 'Data structure design and implementation', '🏗️');

-- ============================================
-- STEP 2: Insert Patterns (93 total)
-- ============================================

-- Category 1: Two Pointer Patterns (7 patterns)
INSERT INTO dsa_patterns (category_id, name, display_order, description, difficulty_level) VALUES
((SELECT id FROM dsa_categories WHERE name = 'Two Pointer Patterns'), 'Two Pointers - Converging (Sorted Array Target Sum)', 1, 'Start from both ends and move towards center', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'Two Pointer Patterns'), 'Two Pointers - Fast & Slow (Cycle Detection)', 2, 'Detect cycles in linked lists using fast and slow pointers', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Two Pointer Patterns'), 'Two Pointers - Fixed Separation (Nth Node from End)', 3, 'Maintain fixed distance between pointers', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'Two Pointer Patterns'), 'Two Pointers - In-place Array Modification', 4, 'Modify arrays in-place using two pointers', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'Two Pointer Patterns'), 'Two Pointers - String Comparison with Backspaces', 5, 'Handle backspace characters in string comparison', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Two Pointer Patterns'), 'Two Pointers - Expanding From Center (Palindromes)', 6, 'Expand from center to find palindromes', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Two Pointer Patterns'), 'Two Pointers - String Reversal', 7, 'Reverse strings or words using two pointers', 'Beginner');

-- Category 2: Sliding Window Patterns (4 patterns)
INSERT INTO dsa_patterns (category_id, name, display_order, description, difficulty_level) VALUES
((SELECT id FROM dsa_categories WHERE name = 'Sliding Window Patterns'), 'Sliding Window - Fixed Size (Subarray Calculation)', 1, 'Fixed window size for subarray calculations', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'Sliding Window Patterns'), 'Sliding Window - Variable Size (Condition-Based)', 2, 'Dynamic window size based on conditions', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Sliding Window Patterns'), 'Sliding Window - Monotonic Queue for Max/Min', 3, 'Use monotonic queue for sliding window maximum/minimum', 'Advanced'),
((SELECT id FROM dsa_categories WHERE name = 'Sliding Window Patterns'), 'Sliding Window - Character Frequency Matching', 4, 'Match character frequencies in sliding window', 'Intermediate');

-- Category 3: Tree Traversal Patterns (6 patterns)
INSERT INTO dsa_patterns (category_id, name, display_order, description, difficulty_level) VALUES
((SELECT id FROM dsa_categories WHERE name = 'Tree Traversal Patterns (DFS & BFS)'), 'Tree BFS - Level Order Traversal', 1, 'Breadth-first level-by-level traversal', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'Tree Traversal Patterns (DFS & BFS)'), 'Tree DFS - Recursive Preorder Traversal', 2, 'Root → Left → Right traversal', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'Tree Traversal Patterns (DFS & BFS)'), 'Tree DFS - Recursive Inorder Traversal', 3, 'Left → Root → Right traversal', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'Tree Traversal Patterns (DFS & BFS)'), 'Tree DFS - Recursive Postorder Traversal', 4, 'Left → Right → Root traversal', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Tree Traversal Patterns (DFS & BFS)'), 'Tree - Lowest Common Ancestor (LCA) Finding', 5, 'Find lowest common ancestor in trees', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Tree Traversal Patterns (DFS & BFS)'), 'Tree - Serialization and Deserialization', 6, 'Convert tree to string and back', 'Advanced');

-- Category 4: Graph Traversal Patterns (12 patterns)
INSERT INTO dsa_patterns (category_id, name, display_order, description, difficulty_level) VALUES
((SELECT id FROM dsa_categories WHERE name = 'Graph Traversal Patterns (DFS & BFS)'), 'Graph DFS - Connected Components / Island Counting', 1, 'Find connected components using DFS', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Graph Traversal Patterns (DFS & BFS)'), 'Graph BFS - Connected Components / Island Counting', 2, 'Find connected components using BFS', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Graph Traversal Patterns (DFS & BFS)'), 'Graph DFS - Cycle Detection (Directed Graph)', 3, 'Detect cycles in directed graphs', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Graph Traversal Patterns (DFS & BFS)'), 'Graph BFS - Topological Sort (Kahn''s Algorithm)', 4, 'Topological ordering using BFS', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Graph Traversal Patterns (DFS & BFS)'), 'Graph - Deep Copy / Cloning', 5, 'Clone graph structures', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Graph Traversal Patterns (DFS & BFS)'), 'Graph - Shortest Path (Dijkstra''s Algorithm)', 6, 'Find shortest path in weighted graphs', 'Advanced'),
((SELECT id FROM dsa_categories WHERE name = 'Graph Traversal Patterns (DFS & BFS)'), 'Graph - Shortest Path (Bellman-Ford / BFS+K)', 7, 'Shortest path with negative weights', 'Advanced'),
((SELECT id FROM dsa_categories WHERE name = 'Graph Traversal Patterns (DFS & BFS)'), 'Graph - Union-Find (Disjoint Set Union - DSU)', 8, 'Union-find for connectivity problems', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Graph Traversal Patterns (DFS & BFS)'), 'Graph - Strongly Connected Components (Kosaraju / Tarjan)', 9, 'Find strongly connected components', 'Advanced'),
((SELECT id FROM dsa_categories WHERE name = 'Graph Traversal Patterns (DFS & BFS)'), 'Graph - Bridges & Articulation Points (Tarjan low-link)', 10, 'Find critical connections', 'Advanced'),
((SELECT id FROM dsa_categories WHERE name = 'Graph Traversal Patterns (DFS & BFS)'), 'Graph - Minimum Spanning Tree (Kruskal / Prim / DSU + heap)', 11, 'Find minimum spanning tree', 'Advanced'),
((SELECT id FROM dsa_categories WHERE name = 'Graph Traversal Patterns (DFS & BFS)'), 'Graph - Bidirectional BFS (BFS optimization for known source & target)', 12, 'Optimized BFS from both ends', 'Advanced');

-- Category 5: Dynamic Programming Patterns (12 patterns)
INSERT INTO dsa_patterns (category_id, name, display_order, description, difficulty_level) VALUES
((SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming (DP) Patterns'), 'DP - 1D Array (Fibonacci Style)', 1, 'Classic DP with state transitions', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming (DP) Patterns'), 'DP - 1D Array (Kadane''s Algorithm for Max/Min Subarray)', 2, 'Maximum subarray sum problems', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming (DP) Patterns'), 'DP - 1D Array (Coin Change / Unbounded Knapsack Style)', 3, 'Unlimited item usage problems', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming (DP) Patterns'), 'DP - 1D Array (0/1 Knapsack Subset Sum Style)', 4, 'Include/exclude decision problems', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming (DP) Patterns'), 'DP - 1D Array (Word Break Style)', 5, 'String segmentation problems', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming (DP) Patterns'), 'DP - 2D Array (Longest Common Subsequence - LCS)', 6, 'String matching problems', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming (DP) Patterns'), 'DP - 2D Array (Edit Distance / Levenshtein Distance)', 7, 'String transformation problems', 'Advanced'),
((SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming (DP) Patterns'), 'DP - 2D Array (Unique Paths on Grid)', 8, 'Grid path counting problems', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming (DP) Patterns'), 'DP - Interval DP', 9, 'Interval-based optimization', 'Advanced'),
((SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming (DP) Patterns'), 'DP - Catalan Numbers', 10, 'Combinatorial problems', 'Advanced'),
((SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming (DP) Patterns'), 'DP - Longest Increasing Subsequence (LIS)', 11, 'Sequence optimization', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Dynamic Programming (DP) Patterns'), 'DP - Stock problems', 12, 'Buy/sell stock optimization', 'Intermediate');

-- Category 6: Heap Patterns (4 patterns)
INSERT INTO dsa_patterns (category_id, name, display_order, description, difficulty_level) VALUES
((SELECT id FROM dsa_categories WHERE name = 'Heap (Priority Queue) Patterns'), 'Heap - Top K Elements (Selection/Frequency)', 1, 'Find K largest/smallest elements', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Heap (Priority Queue) Patterns'), 'Heap - Two Heaps for Median Finding', 2, 'Running median with max and min heaps', 'Advanced'),
((SELECT id FROM dsa_categories WHERE name = 'Heap (Priority Queue) Patterns'), 'Heap - K-way Merge', 3, 'Merge K sorted lists', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Heap (Priority Queue) Patterns'), 'Heap - Scheduling / Minimum Cost (Greedy with Priority Queue)', 4, 'Event scheduling problems', 'Intermediate');

-- Category 7: Backtracking Patterns (7 patterns)
INSERT INTO dsa_patterns (category_id, name, display_order, description, difficulty_level) VALUES
((SELECT id FROM dsa_categories WHERE name = 'Backtracking Patterns'), 'Backtracking - Subsets (Include/Exclude)', 1, 'Generate all subsets', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Backtracking Patterns'), 'Backtracking - Permutations', 2, 'Generate all permutations', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Backtracking Patterns'), 'Backtracking - Combination Sum', 3, 'Find combinations that sum to target', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Backtracking Patterns'), 'Backtracking - Parentheses Generation', 4, 'Generate valid parentheses', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Backtracking Patterns'), 'Backtracking - Word Search / Path Finding in Grid', 5, 'Find paths in grids', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Backtracking Patterns'), 'Backtracking - N-Queens / Constraint Satisfaction', 6, 'Constraint satisfaction problems', 'Advanced'),
((SELECT id FROM dsa_categories WHERE name = 'Backtracking Patterns'), 'Backtracking - Palindrome Partitioning', 7, 'Partition strings into palindromes', 'Intermediate');

-- Category 8: Greedy Patterns (6 patterns)
INSERT INTO dsa_patterns (category_id, name, display_order, description, difficulty_level) VALUES
((SELECT id FROM dsa_categories WHERE name = 'Greedy Patterns'), 'Greedy - Interval Merging/Scheduling', 1, 'Merge overlapping intervals', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Greedy Patterns'), 'Greedy - Jump Game Reachability/Minimization', 2, 'Minimum jumps to reach end', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Greedy Patterns'), 'Greedy - Buy/Sell Stock', 3, 'Stock trading optimization', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'Greedy Patterns'), 'Greedy - Gas Station Circuit', 4, 'Circular array problems', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Greedy Patterns'), 'Greedy - Task Scheduling (Frequency Based)', 5, 'Schedule tasks with constraints', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Greedy Patterns'), 'Greedy - Sorting Based', 6, 'Greedy algorithms using sorting', 'Intermediate');

-- Category 9: Binary Search Patterns (5 patterns)
INSERT INTO dsa_patterns (category_id, name, display_order, description, difficulty_level) VALUES
((SELECT id FROM dsa_categories WHERE name = 'Binary Search Patterns'), 'Binary Search - On Sorted Array/List', 1, 'Classic binary search', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'Binary Search Patterns'), 'Binary Search - Find Min/Max in Rotated Sorted Array', 2, 'Search in rotated arrays', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Binary Search Patterns'), 'Binary Search - On Answer / Condition Function', 3, 'Binary search on answer space', 'Advanced'),
((SELECT id FROM dsa_categories WHERE name = 'Binary Search Patterns'), 'Binary Search - Find First/Last Occurrence', 4, 'Lower and upper bound search', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Binary Search Patterns'), 'Binary Search - Median and Kth of Two Sorted Arrays', 5, 'Merge and find median', 'Advanced');

-- Category 10: Stack Patterns (6 patterns)
INSERT INTO dsa_patterns (category_id, name, display_order, description, difficulty_level) VALUES
((SELECT id FROM dsa_categories WHERE name = 'Stack Patterns'), 'Stack - Valid Parentheses Matching', 1, 'Bracket matching problems', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'Stack Patterns'), 'Stack - Monotonic Stack', 2, 'Next greater/smaller element', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Stack Patterns'), 'Stack - Expression Evaluation (RPN/Infix)', 3, 'Calculator and expression problems', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Stack Patterns'), 'Stack - Simulation / Backtracking Helper', 4, 'Stack for simulation', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Stack Patterns'), 'Stack - Min Stack Design', 5, 'Constant time minimum retrieval', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Stack Patterns'), 'Stack - Largest Rectangle in Histogram', 6, 'Area calculation with stack', 'Advanced');

-- Category 11: Bit Manipulation Patterns (4 patterns)
INSERT INTO dsa_patterns (category_id, name, display_order, description, difficulty_level) VALUES
((SELECT id FROM dsa_categories WHERE name = 'Bit Manipulation Patterns'), 'Bitwise XOR - Finding Single/Missing Number', 1, 'XOR tricks for single number', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'Bit Manipulation Patterns'), 'Bitwise AND - Counting Set Bits (Hamming Weight)', 2, 'Count 1 bits', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'Bit Manipulation Patterns'), 'Bitwise DP - Counting Bits Optimization', 3, 'DP with bit counting', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Bit Manipulation Patterns'), 'Bitwise Operations - Power of Two/Four Check', 4, 'Power of 2 checks', 'Beginner');

-- Category 12: Linked List Patterns (5 patterns)
INSERT INTO dsa_patterns (category_id, name, display_order, description, difficulty_level) VALUES
((SELECT id FROM dsa_categories WHERE name = 'Linked List Manipulation Patterns'), 'Linked List - In-place Reversal', 1, 'Reverse linked lists in-place', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Linked List Manipulation Patterns'), 'Linked List - Merging Two Sorted Lists', 2, 'Merge sorted linked lists', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'Linked List Manipulation Patterns'), 'Linked List - Addition of Numbers', 3, 'Add numbers represented as lists', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Linked List Manipulation Patterns'), 'Linked List - Intersection Detection', 4, 'Find intersection of lists', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Linked List Manipulation Patterns'), 'Linked List - Reordering / Partitioning', 5, 'Reorder and partition lists', 'Intermediate');

-- Category 13: Array/Matrix Patterns (7 patterns)
INSERT INTO dsa_patterns (category_id, name, display_order, description, difficulty_level) VALUES
((SELECT id FROM dsa_categories WHERE name = 'Array/Matrix Manipulation Patterns'), 'Array/Matrix - In-place Rotation', 1, 'Rotate arrays/matrices in-place', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Array/Matrix Manipulation Patterns'), 'Array/Matrix - Spiral Traversal', 2, 'Traverse in spiral order', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Array/Matrix Manipulation Patterns'), 'Array/Matrix - Set Matrix Zeroes (In-place Marking)', 3, 'Set rows/columns to zero', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Array/Matrix Manipulation Patterns'), 'Array - Product Except Self (Prefix/Suffix Products)', 4, 'Product array without division', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Array/Matrix Manipulation Patterns'), 'Array - Plus One (Handling Carry)', 5, 'Handle carry in array arithmetic', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'Array/Matrix Manipulation Patterns'), 'Array - Merge Sorted Array (In-place from End)', 6, 'Merge arrays from end', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'Array/Matrix Manipulation Patterns'), 'Array - Cyclic Sort', 7, 'Sort using cyclic sort pattern', 'Intermediate');

-- Category 14: String Patterns (6 patterns)
INSERT INTO dsa_patterns (category_id, name, display_order, description, difficulty_level) VALUES
((SELECT id FROM dsa_categories WHERE name = 'String Manipulation Patterns'), 'String - Palindrome Check (Two Pointers / Reverse)', 1, 'Check if string is palindrome', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'String Manipulation Patterns'), 'String - Anagram Check (Frequency Count/Sort)', 2, 'Check if strings are anagrams', 'Beginner'),
((SELECT id FROM dsa_categories WHERE name = 'String Manipulation Patterns'), 'String - Roman to Integer Conversion / String to Integer (atoi)', 3, 'Convert between formats', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'String Manipulation Patterns'), 'String - Multiply Strings/Add Strings (Manual Simulation)', 4, 'String arithmetic', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'String Manipulation Patterns'), 'String Matching - Naive / KMP / Rabin-Karp', 5, 'Pattern matching algorithms', 'Advanced'),
((SELECT id FROM dsa_categories WHERE name = 'String Manipulation Patterns'), 'String - Repeated Substring Pattern Detection', 6, 'Detect repeated patterns', 'Intermediate');

-- Category 15: Design Patterns (2 patterns)
INSERT INTO dsa_patterns (category_id, name, display_order, description, difficulty_level) VALUES
((SELECT id FROM dsa_categories WHERE name = 'Design Patterns'), 'Design (General/Specific)', 1, 'Data structure design problems', 'Intermediate'),
((SELECT id FROM dsa_categories WHERE name = 'Design Patterns'), 'Tries', 2, 'Trie data structure problems', 'Intermediate');

-- ============================================
-- STEP 3: Insert Problems (404 total)
-- Due to size, this will be in a separate file
-- See: 002_dsa_problems_seed.sql
-- ============================================

-- Verify the data
SELECT 
  'Categories' AS table_name, 
  COUNT(*) AS count 
FROM dsa_categories
UNION ALL
SELECT 
  'Patterns' AS table_name, 
  COUNT(*) AS count 
FROM dsa_patterns
ORDER BY table_name;
