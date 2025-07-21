export default function CreateView({
  form,
  setForm,
  status,
  setStatus,
  handleSubmit,
  handleSlugChange,
}: {
  form: any;
  setForm: (f: any) => void;
  status: string;
  setStatus: (s: string) => void;
  handleSubmit: (e: React.FormEvent) => void;
  handleSlugChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <>
      <h2 className="text-xl font-semibold text-primary mb-4 text-center">
        Add Location
      </h2>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Location Name"
          value={form.slug}
          onChange={handleSlugChange}
          className="w-full px-4 py-2 rounded-xl border border-border bg-white/90 focus:outline-none focus:ring-2 focus:ring-secondary text-primary"
        />
        <input
          type="text"
          placeholder="Latitude"
          value={form.latitude}
          onChange={(e) => setForm({ ...form, latitude: e.target.value })}
          className="w-full px-4 py-2 rounded-xl border border-border bg-white/90 focus:outline-none focus:ring-2 focus:ring-secondary text-primary"
        />
        <input
          type="text"
          placeholder="Longitude"
          value={form.longitude}
          onChange={(e) => setForm({ ...form, longitude: e.target.value })}
          className="w-full px-4 py-2 rounded-xl border border-border bg-white/90 focus:outline-none focus:ring-2 focus:ring-secondary text-primary"
        />
        <button
          type="submit"
          className="w-full py-2 bg-primary text-white rounded-xl font-semibold hover:bg-secondary transition"
        >
          Add Location
        </button>
        {status && (
          <p className="text-sm text-center mt-2 text-gray-600">{status}</p>
        )}
      </form>
    </>
  );
}
