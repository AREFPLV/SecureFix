# Python 3.12
# Simple helpers for Arctic ice core climate records.
# A record looks like: "STATION:DEPTH:TEMP:YEAR"

import math


def parse_sample(record):
    """
    Read one sample record and return a dictionary.

    Example:
        parse_sample("ARC:250:-18.5:2019")
        -> {"station_id": "ARC", "depth_m": 250, "temp_c": -18.5, "year": 2019}

    Raises ValueError if the record is not valid.
    """

    # The record has to be text.
    if not isinstance(record, str):
        raise ValueError("record must be a string")

    fields = record.split(":")

    # There must be exactly 4 parts: station, depth, temperature, year.
    if len(fields) != 4:
        raise ValueError("record must have exactly 4 colon separated fields")

    station_id = fields[0]
    depth_text = fields[1]
    temp_text = fields[2]
    year_text = fields[3]

    # Station id: exactly 3 uppercase ASCII letters, for example ARC.
    station_ok = (
        len(station_id) == 3
        and station_id.isascii()
        and station_id.isalpha()
        and station_id.isupper()
    )
    if not station_ok:
        raise ValueError("station id must be exactly 3 uppercase letters")

    # Depth: a whole number of metres, greater than 0.
    # isdigit() rejects minus signs, decimal points and empty text.
    if not depth_text.isdigit():
        raise ValueError("depth must be a positive integer")

    depth_m = int(depth_text)
    if depth_m <= 0:
        raise ValueError("depth must be a positive integer")

    # Temperature: use normal float() rules, then reject inf and nan.
    try:
        temp_c = float(temp_text)
    except ValueError:
        raise ValueError("temperature must be a valid float")

    if math.isinf(temp_c) or math.isnan(temp_c):
        raise ValueError("temperature must be a valid float")

    # Year: a 4 digit integer from 1000 to 9999.
    if len(year_text) != 4 or not year_text.isdigit():
        raise ValueError("year must be a 4 digit integer")

    year = int(year_text)
    if year < 1000 or year > 9999:
        raise ValueError("year must be a 4 digit integer")

    sample = {
        "station_id": station_id,
        "depth_m": depth_m,
        "temp_c": temp_c,
        "year": year,
    }
    return sample


if __name__ == "__main__":
    s1 = parse_sample("ARC:250:-18.5:2019")
    print(s1)
