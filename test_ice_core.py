# Simple checks for parse_sample. Run with: python3.12 -m unittest test_ice_core.py

import unittest

from ice_core import parse_sample


class TestParseSample(unittest.TestCase):
    def test_example_record(self):
        sample = parse_sample("ARC:250:-18.5:2019")

        self.assertEqual(
            sample,
            {"station_id": "ARC", "depth_m": 250, "temp_c": -18.5, "year": 2019},
        )
        self.assertIs(type(sample["station_id"]), str)
        self.assertIs(type(sample["depth_m"]), int)
        self.assertIs(type(sample["temp_c"]), float)
        self.assertIs(type(sample["year"]), int)

    def test_second_example_and_other_valid_values(self):
        sample = parse_sample("NOR:750:-22.1:2020")
        self.assertEqual(sample["station_id"], "NOR")
        self.assertEqual(sample["depth_m"], 750)
        self.assertEqual(sample["temp_c"], -22.1)
        self.assertEqual(sample["year"], 2020)

        # Smallest depth, zero degrees, and the first and last allowed years.
        self.assertEqual(parse_sample("ABC:1:0:1000")["depth_m"], 1)
        self.assertEqual(parse_sample("ABC:1:0:1000")["temp_c"], 0.0)
        self.assertEqual(parse_sample("XYZ:12:5.:9999")["year"], 9999)

        # Leading zeros still make a positive integer.
        self.assertEqual(parse_sample("ABC:007:1:2000")["depth_m"], 7)

        # Normal Python float rules: sign, decimal point and scientific notation.
        self.assertEqual(parse_sample("ABC:10:+3.5:2000")["temp_c"], 3.5)
        self.assertEqual(parse_sample("ABC:10:.5:2000")["temp_c"], 0.5)
        self.assertEqual(parse_sample("ABC:10:1e-1:2000")["temp_c"], 0.1)
        self.assertEqual(parse_sample("ABC:10:  -2.5  :2000")["temp_c"], -2.5)

    def test_wrong_number_of_fields(self):
        bad_records = [
            "",
            "ARC",
            "ARC:250:-18.5",
            "ARC:250:-18.5:2019:extra",
            "ARC:250:-18.5:2019:",
            ":ARC:250:-18.5:2019",
        ]
        for record in bad_records:
            with self.assertRaises(ValueError):
                parse_sample(record)

    def test_bad_station_id(self):
        bad_records = [
            "arc:250:-18.5:2019",
            "Arc:250:-18.5:2019",
            "AR:250:-18.5:2019",
            "ARCT:250:-18.5:2019",
            "AR1:250:-18.5:2019",
            "A C:250:-18.5:2019",
            "ÄBC:250:-18.5:2019",
            ":250:-18.5:2019",
        ]
        for record in bad_records:
            with self.assertRaises(ValueError):
                parse_sample(record)

    def test_bad_depth(self):
        bad_records = [
            "ARC:0:-18.5:2019",
            "ARC:00:-18.5:2019",
            "ARC:-5:-18.5:2019",
            "ARC:+5:-18.5:2019",
            "ARC:2.5:-18.5:2019",
            "ARC:250.0:-18.5:2019",
            "ARC:abc:-18.5:2019",
            "ARC::-18.5:2019",
            "ARC: 250:-18.5:2019",
        ]
        for record in bad_records:
            with self.assertRaises(ValueError):
                parse_sample(record)

    def test_bad_temperature(self):
        bad_records = [
            "ARC:250:cold:2019",
            "ARC:250::2019",
            "ARC:250:18,5:2019",
            "ARC:250:inf:2019",
            "ARC:250:INF:2019",
            "ARC:250:+inf:2019",
            "ARC:250:-inf:2019",
            "ARC:250:infinity:2019",
            "ARC:250:-Infinity:2019",
            "ARC:250:nan:2019",
            "ARC:250:NaN:2019",
            "ARC:250:+nan:2019",
            "ARC:250:-nan:2019",
            "ARC:250:1e309:2019",
            "ARC:250:-1e309:2019",
        ]
        for record in bad_records:
            with self.assertRaises(ValueError):
                parse_sample(record)

    def test_bad_year(self):
        bad_records = [
            "ARC:250:-18.5:201",
            "ARC:250:-18.5:20190",
            "ARC:250:-18.5:abcd",
            "ARC:250:-18.5:0999",
            "ARC:250:-18.5:0000",
            "ARC:250:-18.5:+2019",
            "ARC:250:-18.5:2019.0",
            "ARC:250:-18.5:",
            "ARC:250:-18.5: 2019",
        ]
        for record in bad_records:
            with self.assertRaises(ValueError):
                parse_sample(record)

    def test_record_must_be_a_string(self):
        with self.assertRaises(ValueError):
            parse_sample(None)
        with self.assertRaises(ValueError):
            parse_sample(2019)


if __name__ == "__main__":
    unittest.main()
