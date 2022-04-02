"use strict";
const Heap = require('heap');
const { EntrySourcePair, compareEntrySourcePairs } = require('./log-entry-source-utils');

// Print all entries, across all of the *sync* sources, in chronological order.

module.exports = async (logSources, printer) => {
  console.log("Starting async sort.");

  const entries = new Heap(compareEntrySourcePairs);

  await logSources.map(source => {
    entries.push(new EntrySourcePair(source.last, source));
    return source.popAsync();
  });

  while (!entries.empty()) {
    const earliestEntrySource = entries.peek();
    const earliestEntry = earliestEntrySource.entry;
    const earliestLogSource = earliestEntrySource.logSource;

    printer.print(earliestEntry);

    if (earliestLogSource.drained) {
      entries.pop();
    } else {
      entries.replace(new EntrySourcePair(earliestLogSource.last, earliestLogSource));
      await earliestLogSource.pop();
    }
  }
  printer.done();
  return console.log("Async sort complete.");
};
