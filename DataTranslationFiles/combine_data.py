import csv

mortality_file = "mortality_clean.csv"
lifeexp_file = "lifeexp_clean.csv"
output_file = "health_master.csv"

mortality = open(mortality_file, "r", encoding="utf-8-sig", newline="")
lifeexp = open(lifeexp_file, "r", encoding="utf-8-sig", newline="")
output = open(output_file, "w", encoding="utf-8", newline="")

mortality_reader = csv.reader(mortality)
lifeexp_reader = csv.reader(lifeexp)
writer = csv.writer(output)

mortality_rows = list(mortality_reader)
lifeexp_rows = list(lifeexp_reader)

writer.writerow(mortality_rows[0])

for row in mortality_rows[1:]:
    writer.writerow(row)

for row in lifeexp_rows[1:]:
    writer.writerow(row)

mortality.close()
lifeexp.close()
output.close()

print("Done")