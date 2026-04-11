import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function EventDetailLoading() {
  return (
    <main className="mx-auto max-w-4xl px-4 py-10">
      <Card>
        <CardHeader>
          <CardTitle>Loading event detail...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2 text-sm text-muted-foreground">
            <p>Please wait while we fetch the latest event information.</p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
