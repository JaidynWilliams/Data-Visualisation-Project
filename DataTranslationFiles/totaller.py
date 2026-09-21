import csv

input_file = "health_master.csv"
output_file = "health_master_totals.csv"

file = open(input_file, "r", encoding="utf-8-sig", newline="")
reader = csv.DictReader(file)

rows = list(reader)

file.close()


totals = {}


for row in rows:

    if row["measure"] == "Mortality":

        country = row["country"]
        year = row["year"]
        sex = row["sex"]
        method = row["method"]

        key = (country, year, sex, method)

        if key not in totals:
            totals[key] = 0

        totals[key] = totals[key] + float(row["value"])


output = open(output_file, "w", encoding="utf-8", newline="")

headers = [
    "country",
    "year",
    "sex",
    "measure",
    "category",
    "method",
    "unit",
    "value"
]

writer = csv.DictWriter(output, fieldnames=headers)

writer.writeheader()


for row in rows:
    writer.writerow(row)


for key in totals:

    country = key[0]
    year = key[1]
    sex = key[2]
    method = key[3]

    new_row = {}

    new_row["country"] = country
    new_row["year"] = year
    new_row["sex"] = sex
    new_row["measure"] = "Mortality"
    new_row["category"] = "Total"
    new_row["method"] = method
    new_row["unit"] = "Deaths per 100 000 inhabitants"
    new_row["value"] = round(totals[key], 1)

    writer.writerow(new_row)


output.close()

print("Done")
print("Original rows:", len(rows))
print("Total mortality rows added:", len(totals))
print("New rows:", len(rows) + len(totals))