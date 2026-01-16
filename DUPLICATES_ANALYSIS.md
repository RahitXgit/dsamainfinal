# Duplicate Problems Found

Total problems in seed data: **425**
Duplicates found: **21**
Expected unique problems: **404** ✅

## List of Duplicates:

These problems appear in multiple patterns because they can be solved using different approaches:

1. **Course Schedule** (2x)
   - Graph DFS - Cycle Detection
   - Graph BFS - Topological Sort

2. **Course Schedule II** (2x)
   - Graph DFS - Cycle Detection
   - Graph BFS - Topological Sort

3. **Number of Islands** (2x)
   - Graph DFS - Connected Components
   - Graph - Union-Find

4. **Number of Provinces** (2x)
   - Graph DFS - Connected Components
   - Graph - Union-Find

5. **House Robber III** (2x)
   - Tree DFS - Recursive Postorder Traversal
   - DP - 1D Array (Fibonacci Style)

6. **Best Time to Buy and Sell Stock** (2x)
   - Greedy - Buy/Sell Stock
   - DP - Stock problems

7. **Best Time to Buy and Sell Stock II** (2x)
   - Greedy - Buy/Sell Stock
   - DP - Stock problems

8. **Reorganize String** (2x)
   - Heap - Scheduling
   - Greedy - Task Scheduling

9. **Online Stock Span** (2x)
   - Stack - Monotonic Stack
   - Stack - Min Stack Design

10. **Power of Two** (2x)
    - Bitwise AND - Counting Set Bits
    - Bitwise Operations - Power of Two/Four Check

11. **Merge k Sorted Lists** (2x)
    - Heap - K-way Merge
    - Linked List - Merging Two Sorted Lists

12. **Find the Duplicate Number** (2x)
    - Two Pointers - Fast & Slow
    - Array - Cyclic Sort

13. **Missing Number** (2x)
    - Bitwise XOR - Finding Single/Missing Number
    - Array - Cyclic Sort

14. **Add Binary** (2x)
    - Array - Plus One (Handling Carry)
    - String - Multiply Strings/Add Strings

15. **Multiply Strings** (2x)
    - Array - Plus One (Handling Carry)
    - String - Multiply Strings/Add Strings

16. **Find the Index of the First Occurrence in a String** (2x)
    - String Matching - Naive / KMP / Rabin-Karp
    - String - Repeated Substring Pattern Detection

17. **Repeated String Match** (2x)
    - String Matching - Naive / KMP / Rabin-Karp
    - String - Repeated Substring Pattern Detection

18. **Min Stack** (2x)
    - Stack - Min Stack Design
    - Design (General/Specific)

19. **Find Median from Data Stream** (2x)
    - Heap - Two Heaps for Median Finding
    - Design (General/Specific)

20. **Moving Average from Data Stream** (2x)
    - Sliding Window - Fixed Size
    - Design (General/Specific)

21. **Design Search Autocomplete System** (2x)
    - Design (General/Specific)
    - Tries

22. **Kth Smallest Element in a Sorted Matrix** (2x)
    - Heap - K-way Merge
    - Binary Search - Median and Kth of Two Sorted Arrays

23. **Parallel Courses** (2x)
    - Graph BFS - Topological Sort
    - Bitwise DP - Counting Bits Optimization

24. **Squares of a Sorted Array** (2x)
    - Two Pointers - Converging
    - Array - Merge Sorted Array

## Recommendation:

**Keep the duplicates!** 

These duplicates are intentional because:
- They teach multiple solution approaches
- Each pattern demonstrates a different technique
- Students benefit from seeing the same problem in different contexts

The database has a `UNIQUE(pattern_id, title)` constraint, so each problem will only be inserted once per pattern. The total count of 425 is correct for the seed data structure.

If you want exactly 404 unique problems in the database, you would need to decide which pattern to keep for each duplicate and remove it from the other pattern.
