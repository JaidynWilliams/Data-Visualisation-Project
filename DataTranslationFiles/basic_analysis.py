import csv


#put file name here, in parent folder
filename = "health_master_totals.csv"

file = open(filename, "r", encoding="utf-8-sig", newline="")
reader = csv.reader(file)

rows = list(reader)
file.close()

headers = rows[0]
data_rows = rows[1:]

print("=" * 80)
print("CSV BASIC ANALYSIS: ")
print("=" * 80)

print()
print("Number of columns:", len(headers))
print("Number of rows:", len(data_rows))

print()
print("=" * 80)
print("COLUMNS IN ORDER")
print("=" * 80)

column_number = 1
for header in headers:
    print(column_number, "-", header)
    column_number = column_number + 1

print()
print("=" * 80)
print("COLUMN ANALYSIS")
print("=" * 80)

column_index = 0

for header in headers:

    values = []

    for row in data_rows:
        if column_index < len(row):
            values.append(row[column_index].strip())
        else:
            values.append("")

    missing_count = 0
    value_counts = {}

    integer_count = 0
    float_count = 0
    boolean_count = 0
    text_count = 0

    for value in values:

        if value == "":
            missing_count = missing_count + 1

        else:
            if value in value_counts:
                value_counts[value] = value_counts[value] + 1
            else:
                value_counts[value] = 1

            lower_value = value.lower()

            if lower_value == "true" or lower_value == "false":
                boolean_count = boolean_count + 1

            else:
                is_integer = False
                is_float = False

                try:
                    int(value)
                    is_integer = True
                except ValueError:
                    is_integer = False

                if is_integer == True:
                    integer_count = integer_count + 1

                else:
                    try:
                        float(value)
                        is_float = True
                    except ValueError:
                        is_float = False

                    if is_float == True:
                        float_count = float_count + 1
                    else:
                        text_count = text_count + 1

    different_inputs = len(value_counts)

    sorted_values = sorted(
        value_counts.items(),
        key=lambda item: item[1],
        reverse=True
    )

    top_10 = sorted_values[:10]

    numeric_count = integer_count + float_count

    if boolean_count >= numeric_count and boolean_count >= text_count and boolean_count > 0:
        datatype = "Boolean"

    elif numeric_count >= boolean_count and numeric_count >= text_count and numeric_count > 0:
        if float_count > 0:
            datatype = "Float"
        else:
            datatype = "Integer"

    else:
        datatype = "Text"

    invalid_values = {}

    for value in values:

        if value == "":
            continue

        fits_type = False

        if datatype == "Boolean":
            lower_value = value.lower()

            if lower_value == "true" or lower_value == "false":
                fits_type = True

        elif datatype == "Integer":
            try:
                int(value)
                fits_type = True
            except ValueError:
                fits_type = False

        elif datatype == "Float":
            try:
                float(value)
                fits_type = True
            except ValueError:
                fits_type = False

        elif datatype == "Text":
            fits_type = True

        if fits_type == False:
            if value in invalid_values:
                invalid_values[value] = invalid_values[value] + 1
            else:
                invalid_values[value] = 1

    print()
    print("-" * 80)
    print("Column", column_index + 1, "-", header)
    print("-" * 80)

    print("Different non-missing inputs:", different_inputs)
    print("Missing rows:", missing_count)
    print("Most appropriate datatype:", datatype)

    print()
    print("Detected datatype counts:")
    print("  Integer:", integer_count)
    print("  Float:", float_count)
    print("  Boolean:", boolean_count)
    print("  Text:", text_count)

    print()
    print("10 most common non-missing inputs:")

    if len(top_10) == 0:
        print("  No non-missing values")

    else:
        rank = 1

        for value, count in top_10:
            print(" ", rank, "-", repr(value), ":", count)
            rank = rank + 1

    print()
    print("Values that do not fit the chosen datatype:")

    if len(invalid_values) == 0:
        print("  None")

    else:
        invalid_sorted = sorted(
            invalid_values.items(),
            key=lambda item: item[1],
            reverse=True
        )

        for value, count in invalid_sorted:
            print(" ", repr(value), ":", count)

    column_index = column_index + 1

print()
print("=" * 80)
print("ANALYSIS COMPLETE")
print("=" * 80)
