class EntrySourcePair {
  constructor(entry, logSource) {
    this.entry = entry;
    this.logSource = logSource;
  }
}

/**
 * @param {EntrySourcePair} a 
 * @param {EntrySourcePair} b 
 */
function compareEntrySourcePairs(a, b) {
  const dateA = a.entry.date;
  const dateB = b.entry.date;
  if (dateA < dateB) {
    return -1;
  }
  if (dateB < dateA) {
    return 1;
  }
  return 0;
}

module.exports = { EntrySourcePair, compareEntrySourcePairs }