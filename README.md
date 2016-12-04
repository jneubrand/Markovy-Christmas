# Markovy Christmas

The code within this repository is very, very messy. Use at your own risk ;)

If you have no idea what this is, check [this](http://adventofcode.com/2016/day/4) out.

## Some technical background:

a python script (not in this repo) goes through room names in the puzzle, outputting markov chain information for 1 < n < 3 in the format:

```json
{
    "": {
        "northpole": 1,
        "unstable": 62,
        "military": 60
    },
    "bunny user": {
        "testing.": 4
    },
    "flower": {
        "analysis.": 5,
        "purchasing.": 5,
        "storage.": 1
    }
}
```

In order to select the most likely next choice, these are weighted witn `n^5`, thus making pairings with higher `n` values more likely to appear.

A trailing period indicates that the word was the last one in the room's name.

The randomization buttons randomly select words based on the `n^5` ranking.

Example results:
- international military grade basket department.
- magnetic jellybean management.
- biohazardous candy coating logistics.
- biohazardous rabbit services.
- cryogenic bunny department.
- classified plastic grass training.
