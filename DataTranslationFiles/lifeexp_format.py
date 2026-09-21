import csv

input_file = "OECD.ELS.HD,DSD_HEALTH_STAT@DF_HEALTH_STATUS,1.1,filtered,2026-09-20 17-52-32.csv"
output_file = "lifeexp_clean.csv"

file = open(input_file, "r", encoding="utf-8-sig", newline="")
reader = csv.DictReader(file)

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

for row in reader:

    new_row = {}

    new_row["country"] = row["Reference area"]
    new_row["year"] = row["TIME_PERIOD"]
    new_row["sex"] = row["Sex"]
    new_row["measure"] = row["Measure"]

    new_row["category"] = "Total"
    new_row["method"] = ""

    new_row["unit"] = row["Unit of measure"]
    new_row["value"] = row["OBS_VALUE"]

    writer.writerow(new_row)

file.close()
output.close()

print("Done")