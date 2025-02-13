
// Time window for analyzing patterns (in milliseconds)
const ANALYSIS_WINDOW = 5000;
const MAX_CHANGES_PER_SECOND = 15;
const MIN_CHANGES_PER_SECOND = 2;

interface DigitChange {
  position: number;
  value: number;
  timestamp: number;
}

export interface AnomalyReport {
  type: 'frequency' | 'pattern' | 'sequence';
  description: string;
  severity: 'low' | 'medium' | 'high';
  timestamp: number;
  position?: number;
}

export class AnomalyDetector {
  private changes: DigitChange[] = [];
  private lastAnalysis: number = Date.now();
  private onAnomalyDetected: (anomaly: AnomalyReport) => void;

  constructor(onAnomalyDetected: (anomaly: AnomalyReport) => void) {
    this.onAnomalyDetected = onAnomalyDetected;
  }

  addChange(position: number, value: number): void {
    const now = Date.now();
    this.changes.push({ position, value, timestamp: now });

    // Remove old changes outside the analysis window
    this.changes = this.changes.filter(
      change => now - change.timestamp <= ANALYSIS_WINDOW
    );

    // Run analysis every second
    if (now - this.lastAnalysis >= 1000) {
      this.analyze();
      this.lastAnalysis = now;
    }
  }

  private analyze(): void {
    this.detectFrequencyAnomalies();
    this.detectPatternAnomalies();
    this.detectSequenceAnomalies();
  }

  private detectFrequencyAnomalies(): void {
    const now = Date.now();
    const positionCounts = new Map<number, number>();

    // Count changes per position
    this.changes.forEach(change => {
      positionCounts.set(change.position, (positionCounts.get(change.position) || 0) + 1);
    });

    // Check for anomalies in change frequency
    positionCounts.forEach((count, position) => {
      const timeSpan = Math.min(ANALYSIS_WINDOW, now - this.changes[0]?.timestamp);
      const changesPerSecond = (count / timeSpan) * 1000;

      if (changesPerSecond > MAX_CHANGES_PER_SECOND) {
        this.onAnomalyDetected({
          type: 'frequency',
          description: `Digit ${position} changing too rapidly (${changesPerSecond.toFixed(1)} changes/sec)`,
          severity: 'high',
          timestamp: now,
          position
        });
      } else if (changesPerSecond < MIN_CHANGES_PER_SECOND) {
        this.onAnomalyDetected({
          type: 'frequency',
          description: `Digit ${position} changing too slowly (${changesPerSecond.toFixed(1)} changes/sec)`,
          severity: 'low',
          timestamp: now,
          position
        });
      }
    });
  }

  private detectPatternAnomalies(): void {
    const now = Date.now();
    const patternCounts = new Map<string, number>();
    const recentChanges = this.changes.slice(-10);

    for (let i = 0; i < recentChanges.length - 2; i++) {
      const pattern = `${recentChanges[i].position}-${recentChanges[i].value},${recentChanges[i + 1].position}-${recentChanges[i + 1].value}`;
      patternCounts.set(pattern, (patternCounts.get(pattern) || 0) + 1);

      if (patternCounts.get(pattern)! >= 3) {
        this.onAnomalyDetected({
          type: 'pattern',
          description: `Unusual pattern detected: Position ${recentChanges[i].position} repeatedly changing to ${recentChanges[i].value} in sequence`,
          severity: 'medium',
          timestamp: now,
          position: recentChanges[i].position
        });
      }
    }
  }

  private detectSequenceAnomalies(): void {
    const now = Date.now();
    const recentChanges = this.changes.slice(-5);

    let increasingSeq = 1;
    let decreasingSeq = 1;

    for (let i = 1; i < recentChanges.length; i++) {
      if (recentChanges[i].value === recentChanges[i - 1].value + 1) {
        increasingSeq++;
      } else {
        increasingSeq = 1;
      }

      if (recentChanges[i].value === recentChanges[i - 1].value - 1) {
        decreasingSeq++;
      } else {
        decreasingSeq = 1;
      }

      if (increasingSeq >= 3 || decreasingSeq >= 3) {
        this.onAnomalyDetected({
          type: 'sequence',
          description: `Unusual sequential pattern detected at position ${recentChanges[i].position}`,
          severity: 'medium',
          timestamp: now,
          position: recentChanges[i].position
        });
      }
    }
  }
}
