import { useEffect, useState } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "@/components";

type Props = {
  inputBase: string;
  labelBase: string;
  sectionHeader: string;
};

export default function PersonalizationSettings({ inputBase, labelBase, sectionHeader }: Props) {
  const { getToken } = useAuth();

  const [preferences, setPreferences] = useState({
    nickname: "",
    occupation: "",
    about: "",
    customInstructions: "",
  });

  const [initialPreferences, setInitialPreferences] = useState({
    nickname: "",
    occupation: "",
    about: "",
    customInstructions: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const isDirty = JSON.stringify(preferences) !== JSON.stringify(initialPreferences);

  useEffect(() => {
    async function handleGetUserPreferences() {
      const token = await getToken();
      if (!token) return;

      fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/preferences`, {
        headers: { Authorization: `Bearer ${token}` },
      })
        .then(async (res) => {
          const data = await res.json();
          if (!res.ok) throw new Error(data?.message || "Failed to fetch preferences");
          return data;
        })
        .then((data) => {
          const fetchedData = {
            nickname: data.nickname || "",
            occupation: data.occupation || "",
            about: data.about || "",
            customInstructions: data.customInstructions || "",
          };
          setPreferences(fetchedData);
          setInitialPreferences(fetchedData);
        })
        .catch((err) => console.error(err))
        .finally(() => setLoading(false));
    }
    handleGetUserPreferences();
  }, [getToken]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPreferences((prev) => ({ ...prev, [name]: value }));
  };

  async function handleSave() {
    const token = await getToken();
    if (!token) return;

    setSaving(true);
    fetch(`${import.meta.env.VITE_BACKEND_URL}/api/user/preferences`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify(preferences),
    })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data?.message || "Failed to save preferences");
        return data;
      })
      .then(() => {
        setInitialPreferences(preferences);
      })
      .catch((err) => {
        console.error(err);
        alert("Failed to save preferences");
      })
      .finally(() => setSaving(false));
  }

  if (loading) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 space-y-2">
        <Loader size="24" />
        <p className="text-xs">Loading profile...</p>
      </div>
    );
  }

  return (
    <div className="relative h-dvh flex flex-col">
      <div id="personalizationModal" className="flex-1 overflow-y-auto py-4 px-6 ">
        <div className="mb-6">
          <h3 className="text-lg font-normal pb-2 border-b border-gray-500/20 mb-4">Personalization</h3>
          <p className="text-xs text-gray-lab leading-relaxed">Customize your profile details and how the AI behaves during conversations.</p>
        </div>

        <section className="mb-6">
          <h3 className={sectionHeader}>About You</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nickname" className={labelBase}>
                  Nickname
                </label>
                <input
                  id="nickname"
                  name="nickname"
                  autoComplete="name"
                  placeholder="What should I call you?"
                  type="text"
                  className={inputBase}
                  value={preferences.nickname}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="occupation" className={labelBase}>
                  Occupation
                </label>
                <input
                  name="occupation"
                  id="occupation"
                  autoComplete="organization-title"
                  placeholder="e.g. Student, Designer"
                  type="text"
                  className={inputBase}
                  value={preferences.occupation}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="about" className={labelBase}>
                More about you
              </label>
              <textarea
                name="about"
                autoComplete="off"
                placeholder="Hobbies, interests, goals..."
                className={`${inputBase} h-20 resize-none`}
                value={preferences.about}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className={sectionHeader}>AI Behavior</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="customInstructions" className={labelBase}>
                Custom Instructions
              </label>
              <textarea
                name="customInstructions"
                autoComplete="off"
                placeholder="e.g. 'Explain things simply' or 'Reply in JSON'"
                className={`${inputBase} h-24 resize-none`}
                value={preferences.customInstructions}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>
      </div>

      {isDirty && (
        <div className="py-2.5 px-2 border-t border-gray-500/20 bg-white/80 backdrop-blur-sm flex justify-end sticky bottom-0 z-10 animate-in slide-in-from-bottom-2 duration-200">
          <button
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-3 py-2 text-xs font-medium rounded-lg transition-all shadow-sm bg-gray-900 text-white hover:bg-gray-800 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </div>
      )}
    </div>
  );
}
