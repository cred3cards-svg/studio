// Debug Lab level bank. Every program is broken in exactly one place.
// `line` is the 1-based faulty line, `cat` the error category the candidate must pick.
// `patch` on a test rewrites a literal before running, so a hardcoded answer fails.
module.exports = [
{
  id: 1, title: "Counting the sample",
  brief: "Asks how many students, reads that many ages into a list, then reports how many were stored.",
  cat: "SYNTAX", line: 3,
  code: `ages = []
count = int(input("How many students? "))
for i in range(count)
    age = int(input("Enter age: "))
    ages.append(age)
print("Students stored:", len(ages))`,
  tests: [
    { in: "2\n13\n15\n", need: [["noerr"], ["num", 2]], label: "2 ages entered, so 2 records stored" },
    { in: "3\n12\n14\n16\n", need: [["noerr"], ["num", 3]], label: "3 ages entered, so 3 records stored" }
  ]
},
{
  id: 2, title: "Validating the house",
  brief: "Keeps asking for a house until the answer is Saturn or Mars, then confirms it.",
  cat: "NAME", line: 2,
  code: `house = input("Enter house: ")
while house != Saturn and house != Mars:
    print("Invalid house")
    house = input("Enter house: ")
print("House accepted:", house)`,
  tests: [
    { in: "Saturn\n", need: [["noerr"], ["has", "House accepted"], ["nothas", "Invalid house"]],
      label: "Saturn is valid, so it is accepted with no error message" },
    { in: "Pluto\nMars\n", need: [["noerr"], ["has", "Invalid house"], ["has", "Mars"]],
      label: "Pluto is rejected, then Mars is accepted" }
  ]
},
{
  id: 3, title: "Totals for each house",
  brief: "Adds each student's reaction time to their own house total.",
  cat: "LOGIC", line: 8,
  code: `houses = ["Saturn", "Mars", "Saturn"]
times = [0.20, 0.50, 0.30]
saturn_total = 0
mars_total = 0
for i in range(len(houses)):
    if houses[i] == "Saturn":
        saturn_total += times[i]
else:
    mars_total += times[i]
print("Saturn total:", saturn_total)
print("Mars total:", mars_total)`,
  tests: [
    { in: "", need: [["noerr"], ["num", 0.5], ["num", 0.5]], label: "Saturn total 0.20 + 0.30, Mars total 0.50" },
    { in: "", patch: [['[0.20, 0.50, 0.30]', '[0.10, 0.70, 0.40]']],
      need: [["noerr"], ["num", 0.5], ["num", 0.7]], label: "same program, different times" }
  ]
},
{
  id: 4, title: "Totalling the times",
  brief: "Reads two reaction times into a list, then adds the list up.",
  cat: "TYPE", line: 7,
  code: `times = []
for i in range(2):
    time = float(input("Enter reaction time: "))
    times.append(time)
total = 0
for i in range(len(times)):
    total += time[i]
print("Total:", total)`,
  tests: [
    { in: "0.2\n0.3\n", need: [["noerr"], ["num", 0.5]], label: "0.2 + 0.3 totals 0.5" },
    { in: "0.45\n0.25\n", need: [["noerr"], ["num", 0.7]], label: "0.45 + 0.25 totals 0.7" }
  ]
},
{
  id: 5, title: "Average age",
  brief: "Adds up every age in the list and divides by how many there are.",
  cat: "INDEX", line: 3,
  code: `ages = [12, 14, 16]
total = 0
for i in range(len(ages) + 1):
    total += ages[i]
print("Average age:", total / len(ages))`,
  tests: [
    { in: "", need: [["noerr"], ["num", 14]], label: "12, 14 and 16 average 14" },
    { in: "", patch: [['[12, 14, 16]', '[13, 15, 16, 16]']], need: [["noerr"], ["num", 15]],
      label: "same program, four ages" }
  ]
},
{
  id: 6, title: "Mars average",
  brief: "Reads two students, then reports the average reaction time for Mars students.",
  cat: "ZERO", line: 12,
  code: `times = []
houses = []
for i in range(2):
    houses.append(input("Enter house: "))
    times.append(float(input("Enter reaction time: ")))
mars_total = 0
mars_count = 0
for i in range(len(houses)):
    if houses[i] == "Mars":
        mars_total += times[i]
        mars_count += 1
print("Mars average:", mars_total / mars_count)`,
  tests: [
    { in: "Mars\n0.2\nMars\n0.4\n", need: [["noerr"], ["num", 0.3]], label: "two Mars students average 0.3" },
    { in: "Saturn\n0.2\nSaturn\n0.3\n", need: [["noerr"]],
      label: "no Mars students at all — the program must still finish without crashing" }
  ]
},
{
  id: 7, title: "Two house averages",
  brief: "Works out the average reaction time for each house.",
  cat: "LOGIC", line: 3,
  code: `saturn_times = [0.20, 0.30]
mars_times = [0.40, 0.50, 0.60]
saturn_average = sum(saturn_times) / len(mars_times)
mars_average = sum(mars_times) / len(mars_times)
print("Saturn average:", saturn_average)
print("Mars average:", mars_average)`,
  tests: [
    { in: "", need: [["noerr"], ["num", 0.25], ["num", 0.5]], label: "Saturn averages 0.25, Mars averages 0.50" },
    { in: "", patch: [['[0.20, 0.30]', '[0.10, 0.50, 0.30]']], need: [["noerr"], ["num", 0.3], ["num", 0.5]],
      label: "same program, three Saturn times" }
  ]
},
{
  id: 8, title: "Age must be 12 to 16",
  brief: "Ages from 12 to 16 are valid, including 12 and 16 themselves. Anything else is rejected.",
  cat: "LOGIC", line: 2,
  code: `age = int(input("Enter age: "))
while age <= 12 or age >= 16:
    print("Age must be from 12 to 16")
    age = int(input("Enter age: "))
print("Age accepted:", age)`,
  tests: [
    { in: "12\n", need: [["noerr"], ["has", "Age accepted"], ["nothas", "Age must be"]],
      label: "12 is inside the range, so it is accepted straight away" },
    { in: "16\n", need: [["noerr"], ["has", "Age accepted"], ["nothas", "Age must be"]],
      label: "16 is inside the range, so it is accepted straight away" },
    { in: "17\n14\n", need: [["noerr"], ["has", "Age must be"], ["has", "Age accepted"]],
      label: "17 is rejected, then 14 is accepted" }
  ]
},
{
  id: 9, title: "The slowest student",
  brief: "Finds the slowest reaction time in the list. Slower means a bigger number.",
  cat: "LOGIC", line: 4,
  code: `times = [0.31, 0.22, 0.48, 0.25]
slowest = times[0]
for i in range(len(times)):
    if times[i] < slowest:
        slowest = times[i]
print("Slowest reaction time:", slowest)`,
  tests: [
    { in: "", need: [["noerr"], ["num", 0.48]], label: "0.48 is the slowest of those four" },
    { in: "", patch: [['[0.31, 0.22, 0.48, 0.25]', '[0.52, 0.19, 0.33, 0.41]']], need: [["noerr"], ["num", 0.52]],
      label: "same program, different times" }
  ]
},
{
  id: 10, title: "Running total",
  brief: "Adds up the reaction times of the Saturn students only.",
  cat: "LOGIC", line: 4,
  code: `houses = ["Saturn", "Saturn", "Mars"]
times = [0.20, 0.40, 0.55]
for i in range(len(houses)):
    saturn_total = 0
    if houses[i] == "Saturn":
        saturn_total += times[i]
print("Saturn total:", saturn_total)`,
  tests: [
    { in: "", need: [["noerr"], ["num", 0.6]], label: "0.20 + 0.40 totals 0.60" },
    { in: "", patch: [['[0.20, 0.40, 0.55]', '[0.15, 0.35, 0.90]']], need: [["noerr"], ["num", 0.5]],
      label: "same program, different times" }
  ]
}
];
