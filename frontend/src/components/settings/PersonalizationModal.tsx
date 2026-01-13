import { useEffect, useMemo, useState, type Dispatch } from "react";
import { useAuth } from "@clerk/clerk-react";
import { Loader } from "@/components";
import type { UserPreferences } from "@app/shared/src/types";
import { apiRequest } from "@/utils/api";
import { validate } from "@/utils/validate";
import { userPreferencesSchema } from "@app/shared/src/schemas/user.schema";

type Props = {
  preferences: UserPreferences | null;
  setPreferences: Dispatch<React.SetStateAction<UserPreferences | null>>;
  initialPreferences: UserPreferences | null;
  setInitialPreferences: Dispatch<React.SetStateAction<UserPreferences | null>>;
};

export default function PersonalizationSettings({ preferences, setPreferences, initialPreferences, setInitialPreferences }: Props) {
  const { getToken } = useAuth();

  const [loading, setLoading] = useState(!preferences);
  const [saving, setSaving] = useState(false);

  const data = useMemo(() => preferences || { nickname: "", occupation: "", about: "", customInstructions: "" }, [preferences]);

  const isDirty = JSON.stringify(preferences) !== JSON.stringify(initialPreferences);

  useEffect(() => {
    if (preferences) {
      setLoading(false);
      return;
    }

    async function handleGetUserPreferences() {
      setLoading(true);

      const result = validate(userPreferencesSchema, data, "Please refresh the page and try again.");
      if (!result) {
        setLoading(false);
        return;
      }

      try {
        const token = await getToken();
        if (!token) throw new Error("You must be logged in to get preferences.");

        const data = await apiRequest(`${import.meta.env.VITE_BACKEND_URL}/api/user/preferences`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const fetchedData = {
          nickname: data.nickname || "",
          occupation: data.occupation || "",
          about: data.about || "",
          customInstructions: data.customInstructions || "",
        };
        setPreferences(fetchedData);
        setInitialPreferences(fetchedData);
      } finally {
        setLoading(false);
      }
    }

    handleGetUserPreferences();
  }, [data, getToken, preferences, setInitialPreferences, setPreferences]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setPreferences((prev) => (prev ? { ...prev, [name]: value } : { ...data, [name]: value }));
  };

  async function handleSave() {
    if (!preferences) return;
    setSaving(true);

    try {
      const token = await getToken();
      if (!token) throw new Error("You must be logged in to save changes.");

      await apiRequest(`${import.meta.env.VITE_BACKEND_URL}/api/user/preferences`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify(preferences),
        successMessage: "Changes saved successfully!",
      });
      setInitialPreferences(preferences);
    } finally {
      setSaving(false);
    }
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
      <div className="flex-1 overflow-y-auto px-6 sm:py-4 py-6 custom-scroll custom-scroll-sm">
        <div className="mb-6">
          <h3 className="text-lg font-normal pb-2 border-b border-gray-500/20 mb-4">Personalization</h3>
          <p className="text-xs text-gray-lab leading-relaxed">Customize your profile details and how the AI behaves during conversations.</p>
        </div>

        <section className="mb-6">
          <h3 className="text-sm font-semibold text-primary pb-2 border-b border-gray-100 mb-3 mt-1">About You</h3>
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="nickname" className="sm:text-xs text-sm font-medium mb-1.5 block text-gray-700">
                  Nickname
                </label>
                <input
                  id="nickname"
                  name="nickname"
                  autoComplete="name"
                  placeholder="What should I call you?"
                  type="text"
                  className="w-full px-3 py-2 text-sm sm:text-xs border border-gray-500/20 rounded-lg outline-none transition"
                  value={data.nickname as string}
                  onChange={handleChange}
                />
              </div>

              <div>
                <label htmlFor="occupation" className="sm:text-xs text-sm font-medium mb-1.5 block text-gray-700">
                  Occupation
                </label>
                <input
                  name="occupation"
                  id="occupation"
                  autoComplete="organization-title"
                  placeholder="e.g. Student, Designer"
                  type="text"
                  className="w-full px-3 py-2 text-sm sm:text-xs border border-gray-500/20 rounded-lg outline-none transition"
                  value={data.occupation as string}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div>
              <label htmlFor="about" className="sm:text-xs text-sm font-medium mb-1.5 block text-gray-700">
                More about you
              </label>
              <textarea
                name="about"
                autoComplete="off"
                placeholder="Hobbies, interests, goals..."
                className="w-full px-3 py-2 text-sm sm:text-xs border border-gray-500/20 rounded-lg outline-none transition h-20 resize-none custom-scroll custom-scroll-xs"
                value={data.about as string}
                onChange={handleChange}
              />
            </div>
          </div>
        </section>

        <section>
          <h3 className="text-sm font-semibold text-primary pb-2 border-b border-gray-100 mb-3 mt-1">AI Behavior</h3>
          <div className="space-y-4">
            <div>
              <label htmlFor="customInstructions" className="sm:text-xs text-sm font-medium mb-1.5 block text-gray-700">
                Custom Instructions
              </label>
              <textarea
                name="customInstructions"
                autoComplete="off"
                placeholder="e.g. 'Explain things simply' or 'Reply in JSON'"
                className="w-full px-3 py-2 text-sm sm:text-xs border border-gray-500/20 rounded-lg outline-none transition h-24 resize-none"
                value={data.customInstructions as string}
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
