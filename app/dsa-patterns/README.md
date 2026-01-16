# DSA Patterns Page

## Overview

The DSA Patterns page displays all 425 problems organized in a 3-level hierarchy:
- **Level 1**: 15 Categories (e.g., "Two Pointer Patterns", "Dynamic Programming")
- **Level 2**: 93 Patterns (e.g., "Two Pointers - Converging", "DP - Fibonacci Style")
- **Level 3**: 425 Problems (individual LeetCode problems)

## Features

### ✅ 3-Level Collapsible Hierarchy
- Click on categories to expand/collapse patterns
- Click on patterns to expand/collapse problems
- Smooth animations with pixel theme styling

### 🔍 Search Functionality
- Real-time search across all problem titles
- Filters categories/patterns with no matching problems

### 🎯 Difficulty Filters
- Filter by: All, Easy, Medium, Hard
- Color-coded difficulty badges:
  - **Easy**: Green
  - **Medium**: Yellow
  - **Hard**: Red

### 🎨 Pixel Theme Styling
- Chunky borders and 3D shadows
- Retro gaming aesthetic
- Hover effects and animations
- Consistent with app theme

### 📊 Statistics
- Total problems count
- Problems per category
- Problems per pattern
- Premium problem indicators

### 🔗 Direct Links
- "SOLVE →" button for each problem
- Opens LeetCode in new tab
- Auto-generated URLs from problem titles

## Page Structure

```
DSA Patterns Page
├── Header (Search + Filters)
├── Categories (15)
│   ├── Category Header (Icon, Name, Stats)
│   └── Patterns (93 total)
│       ├── Pattern Header (Name, Description, Difficulty)
│       └── Problems (425 total)
│           ├── Problem Number
│           ├── Problem Title
│           ├── Difficulty Badge
│           └── Solve Button (LeetCode link)
```

## Usage

### Navigation
Access via navbar: **DSA PATTERNS** link

### Browsing
1. Click a category to see its patterns
2. Click a pattern to see its problems
3. Click "SOLVE →" to open problem on LeetCode

### Searching
- Type in search box to filter problems
- Results update in real-time
- Empty state shown if no matches

### Filtering
- Click difficulty buttons (ALL/EASY/MEDIUM/HARD)
- Only matching problems shown
- Combine with search for precise results

## Data Source

Problems are fetched from Supabase tables:
- `dsa_categories` - 15 categories
- `dsa_patterns` - 93 patterns  
- `dsa_problems` - 425 problems

## Technical Details

### Component: `/app/dsa-patterns/page.tsx`
- Client-side rendered
- React hooks for state management
- Supabase for data fetching
- Real-time search/filter

### State Management
- `categories` - Full hierarchy data
- `expandedCategories` - Set of expanded category IDs
- `expandedPatterns` - Set of expanded pattern IDs
- `searchQuery` - Current search text
- `difficultyFilter` - Selected difficulty

### Performance
- Single data fetch on mount
- Client-side filtering (fast)
- Lazy rendering (only expanded items)
- Optimized re-renders

## Styling Classes

### Custom Classes Used
- `.glassmorphism` - Semi-transparent background
- `.pixel-card` - Problem card styling
- `.pixel-badge` - Difficulty/count badges
- `.pixel-spinner` - Loading animation
- `.btn` - Button styling

### Tailwind Utilities
- Border: `border-4 border-black`
- Shadow: `shadow-[4px_4px_0px_#000]`
- Hover: `hover:translate-x-[-2px]`

## Future Enhancements

### Potential Features
- [ ] User progress tracking per problem
- [ ] Mark problems as solved
- [ ] Bookmark favorite problems
- [ ] Filter by solved/unsolved
- [ ] Sort by difficulty/name
- [ ] Export problem list
- [ ] Print-friendly view
- [ ] Dark/light mode toggle
- [ ] Problem notes/solutions
- [ ] Spaced repetition reminders

## Related Files

- `/components/Navbar.tsx` - Navigation link
- `/lib/supabase.ts` - Database client
- `/app/globals.css` - Pixel theme styles
- `/scripts/seedDSAProblems.ts` - Data seeding

## Troubleshooting

### Problems not showing
- Check database is seeded
- Verify Supabase connection
- Check browser console for errors

### Search not working
- Clear search box
- Try different keywords
- Check filter settings

### Links not opening
- Verify `leetcode_url` in database
- Check popup blocker settings
- Try right-click → Open in new tab
