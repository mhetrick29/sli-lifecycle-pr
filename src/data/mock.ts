export const OLD_SLO_YAML = `service-id: 724c33bf-1ab8-4691-adb1-0e61932919c2
datasources:
  - id: cosmosdbmdm
    type: mdm
    accountIds:
      - DocumentDB
      - DocumentDB-Fairfax
      - DocumentDB-Mooncake

slo-groups:
  - name: Cosmos DB Availability - V4
    state: Production
    slis:
      - name: Regional DatabaseAccount Availability - V4
        source-id: cosmosdbmdm
        category: Availability
        description: Regional Database Account Availability - 99.999% for Read and Write in 5m

        window: 5m

        namespace: DocDB
        signal: |-
          metric("CosmosDBRequest")
          .dimensions(
            "Microsoft.resourceId" as CustomerResourceId,
            "IsExternal",
            "LocationId" as LocationId)
          .samplingTypes("Count")
          | where IsExternal == "True"
              and LocationId !in ("<empty>", "ms-loc://az/azurepubliccloud/centralus",
          "ms-loc://az/azurepubliccloud/eastus")
              and CustomerResourceId !in ("_empty")
          | summarize
              TotalRequests = sum(Count)
            by
              CustomerResourceId,
              LocationId
          | join kind = leftouter
          (
              metric("CosmosDBRequest")
              .dimensions(
                "Microsoft.resourceId" as CustomerResourceId,
                "IsExternal",
                "LocationId" as LocationId)
              .samplingTypes("Count")
              | where IsExternal == "True"
                  and StatusCode startswith "5"
              | summarize
                  FailedRequests = sum(Count)
                by
                  CustomerResourceId,
                  LocationId
          ) on CustomerResourceId, LocationId`;

export const NEW_SLO_YAML = `service-id: 724c33bf-1ab8-4691-adb1-0e61932919c2
datasources:
  - id: cosmosdbmdm
    type: mdm
    accountIds:
      - DocumentDB
      - DocumentDB-Fairfax
      - DocumentDB-Mooncake

slo-groups:
  - name: Cosmos DB Availability - V4
    state: Production
    slis:
      - name: Regional DatabaseAccount Availability - V4
        source-id: cosmosdbmdm
        category: Availability
        description: Regional Database Account Availability - 99.999% for Read and Write in 5m

        window: 5m

        namespace: DocDB
        signal: |-
          metric("CosmosDBRequest")
          .dimensions(
            "Microsoft.resourceId" as CustomerResourceId,
            "IsExternal",
            "LocationId" as LocationId,
            "PartitionKey" as PartitionKey)
          .samplingTypes("Count")
          | where IsExternal == "True"
              and LocationId !in ("<empty>", "ms-loc://az/azurepubliccloud/centralus",
          "ms-loc://az/azurepubliccloud/eastus")
              and CustomerResourceId !in ("_empty")
          | summarize
              TotalRequests = sum(Count)
            by
              CustomerResourceId,
              LocationId,
              PartitionKey
          | join kind = leftouter
          (
              metric("CosmosDBRequest")
              .dimensions(
                "Microsoft.resourceId" as CustomerResourceId,
                "IsExternal",
                "LocationId" as LocationId,
                "PartitionKey" as PartitionKey)
              .samplingTypes("Count")
              | where IsExternal == "True"
                  and StatusCode startswith "5"
              | summarize
                  FailedRequests = sum(Count)
                by
                  CustomerResourceId,
                  LocationId,
                  PartitionKey
          ) on CustomerResourceId, LocationId, PartitionKey`;

export const DIFF_LINES: { type: "same" | "added" | "removed"; text: string }[] = [
  { type: "same", text: '          .dimensions(' },
  { type: "same", text: '            "Microsoft.resourceId" as CustomerResourceId,' },
  { type: "same", text: '            "IsExternal",' },
  { type: "removed", text: '            "LocationId" as LocationId)' },
  { type: "added", text: '            "LocationId" as LocationId,' },
  { type: "added", text: '            "PartitionKey" as PartitionKey)' },
  { type: "same", text: '          .samplingTypes("Count")' },
  { type: "same", text: '          | where IsExternal == "True"' },
  { type: "same", text: '              and LocationId !in ("<empty>", ...)' },
  { type: "same", text: '          | summarize' },
  { type: "same", text: '              TotalRequests = sum(Count)' },
  { type: "same", text: '            by' },
  { type: "same", text: '              CustomerResourceId,' },
  { type: "removed", text: '              LocationId' },
  { type: "added", text: '              LocationId,' },
  { type: "added", text: '              PartitionKey' },
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

export const REVIEWERS = {
  required: [
    { name: "James Chen", avatar: "JC", status: "pending" as const },
  ],
  optional: [
    { name: "Sarah Patel", avatar: "SP", status: "approved" as const },
    { name: "Alex Rivera", avatar: "AR", status: "pending" as const },
    { name: "Mika Johansson", avatar: "MJ", status: "pending" as const },
    { name: "Devon Bradley", avatar: "DB", status: "pending" as const },
    { name: "Yuki Tanaka", avatar: "YT", status: "pending" as const },
    { name: "Chris Morgan", avatar: "CM", status: "pending" as const },
    { name: "Leah Foster", avatar: "LF", status: "pending" as const },
    { name: "Raj Krishnan", avatar: "RK", status: "pending" as const },
    { name: "Nina Vogt", avatar: "NV", status: "pending" as const },
    { name: "Omar Hassan", avatar: "OH", status: "pending" as const },
  ],
};
