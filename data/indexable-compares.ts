/**
 * Compare URLs kept in the Google index.
 * Seeded from hand-written Radar Feed links where at least one robot is
 * buy_now or pre_order, preferring a shared primary task, newest first.
 * Cap: 20. Other compare URLs stay available and noindex.
 */
export const INDEXABLE_COMPARE_PAIRS: readonly (readonly [string, string])[] = [
  ["isaac-1", "neo-gamma"],
  ["microduck", "reachy-mini"],
  ["doova", "elliq"],
  ["elliq", "fidi"],
  ["loona", "vector-2"],
  ["elliq", "mirokai"],
  ["ebo-x", "lg-q9"],
  ["emo-companion", "vector-2"],
  ["neo-gamma", "unitree-g1"],
  ["figure-02", "neo-gamma"],
  ["optimus-gen2", "unitree-g1"],
  ["realbotix-melody", "ubtech-u1"],
  ["dobot-atom", "unitree-g1"],
  ["dobot-atom", "pm01"],
  ["emo-companion", "tcl-aime"],
  ["emo-companion", "kiki"],
  ["kiki", "vector-2"],
  ["casbot-01", "pm01"],
  ["realbotix-aria", "ubtech-u1"],
  ["reachy-2", "reachy-mini"],
];
