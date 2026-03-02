export const OLD_SLO_YAML = `apiVersion: slo/v2
kind: ServiceLevelObjective
metadata:
  name: cosmosdb-availability
  service: CosmosDB
  owner: cosmosdb-oncall@microsoft.com
spec:
  description: "CosmosDB document read/write success rate"
  slis:
    - name: success-rate
      type: availability
      metric:
        source: geneva/mdm
        namespace: CosmosDB
        metric: RequestSuccessRate
      dimensions:
        - name: Region
          type: location
        - name: DatabaseAccount
          type: resource
      objective:
        target: 99.95
        window: 1h
  brain:
    monitor: cosmosdb-success-rate
    mode: outage
    models:
      - opm
      - error-budget`;

export const NEW_SLO_YAML = `apiVersion: slo/v2
kind: ServiceLevelObjective
metadata:
  name: cosmosdb-availability
  service: CosmosDB
  owner: cosmosdb-oncall@microsoft.com
spec:
  description: "CosmosDB document read/write success rate"
  slis:
    - name: success-rate
      type: availability
      metric:
        source: geneva/mdm
        namespace: CosmosDB
        metric: RequestSuccessRate
      dimensions:
        - name: Region
          type: location
        - name: DatabaseAccount
          type: resource
        - name: PartitionKey
          type: partition
      objective:
        target: 99.95
        window: 1h
  brain:
    monitor: cosmosdb-success-rate
    mode: outage
    models:
      - opm
      - error-budget`;

export const DIFF_LINES: { type: "same" | "added" | "removed"; text: string }[] = [
  { type: "same", text: "      dimensions:" },
  { type: "same", text: "        - name: Region" },
  { type: "same", text: "          type: location" },
  { type: "same", text: "        - name: DatabaseAccount" },
  { type: "same", text: "          type: resource" },
  { type: "added", text: "        - name: PartitionKey" },
  { type: "added", text: "          type: partition" },
  { type: "same", text: "      objective:" },
  { type: "same", text: "        target: 99.95" },
  { type: "same", text: "        window: 1h" },
];

export const QUALITY_CHECKS = [
  { name: "Dimension format", status: "pass" as const, detail: "All dimensions have valid name/type pairs" },
  { name: "LID format", status: "pass" as const, detail: "Metric identifier follows LID schema" },
  { name: "Namespace exists", status: "pass" as const, detail: "CosmosDB namespace verified in Geneva" },
  { name: "Objective range", status: "pass" as const, detail: "Target 99.95% is within valid range" },
  { name: "New dimension cardinality", status: "warn" as const, detail: "PartitionKey may have high cardinality — verify scale" },
];

export const SIGNAL_DATA = Array.from({ length: 48 }, (_, i) => {
  const base = 99.97;
  const noise = (Math.sin(i * 0.5) * 0.02) + (Math.random() - 0.5) * 0.01;
  const dip = i >= 30 && i <= 34 ? -(0.15 - Math.abs(i - 32) * 0.04) : 0;
  return { hour: i, value: Math.max(99.5, Math.min(100, base + noise + dip)) };
});

export const AUTOMATED_CHECKS = [
  { name: "Capacity check", status: "pass" as const, detail: "• SLI pipeline: Sufficient capacity for additional dimension\n• Brain pipeline: GPU quota available for retraining" },
  { name: "Quality validation", status: "pass" as const, detail: "Minimum bar: quality score of 2/4" },
  { name: "Security check", status: "pending" as const, detail: "No PII detected" },
];

export const TIMELINE_EVENTS = [
  {
    time: "2024-12-15T11:00:00Z",
    title: "Brain monitor retraining started",
    description: "Estimated completion: 24–48 hours",
    status: "in_progress" as const,
  },
];

export const REVIEW_METRICS = {
  before: {
    incidentsDetected: 142,
    noiseRate: "4.2%",
    precision: "95.8%",
    coverage: "87.3%",
    timeToDetect: "4.2 min",
  },
  after: {
    incidentsDetected: 158,
    noiseRate: "3.8%",
    precision: "96.2%",
    coverage: "97.8%",
    timeToDetect: "3.1 min",
  },
};

export const SAMPLE_INCIDENTS = [
  {
    id: "482901537",
    title: "CosmosDB read latency spike — East US 2",
    status: "added" as const,
    detail: "Detected via new PartitionKey dimension granularity",
  },
  {
    id: "739205814",
    title: "Throttling on hot partition — West Europe",
    status: "added" as const,
    detail: "Previously missed due to aggregation across partitions",
  },
  {
    id: "615847293",
    title: "Transient failover noise — Central US",
    status: "removed" as const,
    detail: "No longer triggers — noise reduction from granular dimensions",
  },
  {
    id: "928374610",
    title: "Write availability drop — South East Asia",
    status: "added" as const,
    detail: "Partition-level detection catches localized write failures",
  },
];

export const REVIEWERS = [
  { name: "Sarah Chen", role: "Brain SRE Lead", avatar: "SC", status: "approved" as const },
  { name: "James Park", role: "CosmosDB Oncall", avatar: "JP", status: "approved" as const },
  { name: "Priya Sharma", role: "SLI Platform", avatar: "PS", status: "pending" as const },
];
