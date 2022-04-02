"use strict";
const Heap = require('heap');
const { EntrySourcePair, compareEntrySourcePairs } = require('./log-entry-source-utils');

// Print all entries, across all of the *sync* sources, in chronological order.

module.exports = (logSources, printer) => {
  console.log("Starting sync sort.");

  const entries = new Heap(compareEntrySourcePairs);

  logSources.forEach(source => {
    entries.push(new EntrySourcePair(source.last, source));
    source.pop();
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
      earliestLogSource.pop();
    }
  }
  printer.done();
  return console.log("Sync sort complete.");
};
