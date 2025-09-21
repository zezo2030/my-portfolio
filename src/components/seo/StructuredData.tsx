"use client";

interface StructuredDataProps {
  data: Record<string, unknown>;
}

export function StructuredData({ data }: StructuredDataProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data, null, 2),
      }}
    />
  );
}

// Component for multiple structured data objects
interface MultipleStructuredDataProps {
  dataArray: Array<Record<string, unknown>>;
}

export function MultipleStructuredData({ dataArray }: MultipleStructuredDataProps) {
  return (
    <>
      {dataArray.map((data, index) => (
        <StructuredData key={index} data={data} />
      ))}
    </>
  );
}