// Quick script to find duplicates in DSA problems

const dsaProblems = require('./seedDSAProblems.ts')

const allProblems = []
const problemCounts = new Map()

// Extract all problems
for (const [categoryName, patterns] of Object.entries(dsaProblems.dsaProblems || {})) {
    for (const [patternName, problems] of Object.entries(patterns)) {
        for (const problem of problems) {
            allProblems.push({
                title: problem.title,
                category: categoryName,
                pattern: patternName
            })

            const count = problemCounts.get(problem.title) || 0
            problemCounts.set(problem.title, count + 1)
        }
    }
}

console.log(`Total problems in seed data: ${allProblems.length}`)
console.log(`\nDuplicates found:\n`)

const duplicates = []
for (const [title, count] of problemCounts.entries()) {
    if (count > 1) {
        duplicates.push({ title, count })
        console.log(`"${title}" appears ${count} times`)

        // Show where it appears
        const locations = allProblems.filter(p => p.title === title)
        locations.forEach((loc, idx) => {
            console.log(`  ${idx + 1}. ${loc.category} → ${loc.pattern}`)
        })
        console.log()
    }
}

console.log(`\nTotal unique problems: ${problemCounts.size}`)
console.log(`Total duplicates: ${duplicates.length}`)
console.log(`Expected total after removing duplicates: ${allProblems.length - duplicates.reduce((sum, d) => sum + (d.count - 1), 0)}`)
