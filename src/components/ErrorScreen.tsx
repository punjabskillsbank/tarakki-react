export function ErrorScreen({ error }: { error: string }) {
  return (
    <div className="flex items-center justify-center p-8 h-screen font-bold text-3xl">
      Error: {error}
    </div>
  );
}
