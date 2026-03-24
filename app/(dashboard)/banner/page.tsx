"use client";
import React, { useEffect, useState } from "react";
import { addBanner, updateBanner, getBanners, Banner } from "../../../src/services/banner/bannerService";
import { deleteBanner } from "../../../src/services/banner/deleteBanner";
import { uploadBannerImage } from "../../../src/services/banner/uploadBannerImage";

const initialState = {
  title: "",
  redirect_url: "",
  is_active: true,
  image_url: "",
};

const BannerForm = ({ onSuccess, editBanner }: { onSuccess: () => void; editBanner?: Banner }) => {
  const [form, setForm] = useState<Banner>(editBanner || initialState);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(editBanner?.image_url || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    let fieldValue: string | boolean = value;
    if (type === "checkbox") {
      fieldValue = (e.target as HTMLInputElement).checked;
    }
    setForm((prev) => ({
      ...prev,
      [name]: fieldValue,
    }));
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      let imageUrl = form.image_url;
      if (imageFile) {
        const url = await uploadBannerImage(imageFile);
        if (!url) throw new Error("Image upload failed");
        imageUrl = url;
      }
      if (editBanner && editBanner.id) {
        await updateBanner(editBanner.id, { ...form, image_url: imageUrl });
      } else {
        await addBanner({ ...form, image_url: imageUrl });
      }
      onSuccess();
    } catch (err: any) {
      setError(err.message || "Error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form className="space-y-4 max-w-lg mx-auto" onSubmit={handleSubmit}>
      <h2 className="text-2xl font-bold mb-2">{editBanner ? "Edit Banner" : "Add Banner"}</h2>
      <div>
        <label className="block font-medium mb-1">Title</label>
        <input
          className="border px-3 py-2 rounded w-full"
          name="title"
          value={form.title}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Redirect URL</label>
        <input
          className="border px-3 py-2 rounded w-full"
          name="redirect_url"
          value={form.redirect_url}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label className="block font-medium mb-1">Banner Image</label>
        <input type="file" accept="image/*" onChange={handleImageChange} />
        {imagePreview && <img src={imagePreview} alt="Preview" className="mt-2 max-h-40 rounded" />}
      </div>
      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          name="is_active"
          checked={form.is_active}
          onChange={handleChange}
          id="is_active"
        />
        <label htmlFor="is_active">Active</label>
      </div>
      {error && <div className="text-red-500">{error}</div>}
      <button
        type="submit"
        className="bg-[#11009E] text-white px-4 py-2 rounded hover:bg-indigo-800"
        disabled={loading}
      >
        {loading ? "Saving..." : editBanner ? "Save Changes" : "Add Banner"}
      </button>
    </form>
  );
};

const Page = () => {
  const [showForm, setShowForm] = useState(false);
  const [refresh, setRefresh] = useState(0);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editBanner, setEditBanner] = useState<Banner | undefined>(undefined);

  useEffect(() => {
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getBanners();
        setBanners(data || []);
      } catch (err: any) {
        setError(err.message || "Failed to load banners");
      } finally {
        setLoading(false);
      }
    })();
  }, [refresh]);

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this banner?")) return;
    try {
      await deleteBanner(id);
      setRefresh((r) => r + 1);
    } catch (err: any) {
      alert(err.message || "Delete failed");
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold">Banner Management</h1>
        <button
          className="bg-[#11009E] text-white px-4 py-2 rounded hover:bg-indigo-800"
          onClick={() => {
            setShowForm((v) => !v);
            setEditBanner(undefined);
          }}
        >
          {showForm ? "Close" : "Add Banner"}
        </button>
      </div>
      {showForm && (
        <BannerForm
          onSuccess={() => {
            setShowForm(false);
            setEditBanner(undefined);
            setRefresh((r) => r + 1);
          }}
          editBanner={editBanner}
        />
      )}
      <div className="mt-8">
        {loading ? (
          <div>Loading...</div>
        ) : error ? (
          <div className="text-red-500">{error}</div>
        ) : banners.length === 0 ? (
          <div>No banners found.</div>
        ) : (
          <table className="min-w-full border text-sm">
            <thead>
              <tr className="bg-gray-100">
                <th className="border px-3 py-2">Title</th>
                <th className="border px-3 py-2">Redirect URL</th>
                <th className="border px-3 py-2">Active</th>
                <th className="border px-3 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              {banners.map((banner) => (
                <tr key={banner.id}>
                  <td className="border px-3 py-2">{banner.title}</td>
                  <td className="border px-3 py-2">
                    <a href={banner.redirect_url} className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">
                      {banner.redirect_url}
                    </a>
                  </td>
                  <td className="border px-3 py-2 text-center">{banner.is_active ? "✔️" : "❌"}</td>
                  <td className="border px-3 py-2 flex gap-2">
                    <button
                      className="border px-2 py-1 rounded hover:bg-gray-100"
                      onClick={() => {
                        setEditBanner(banner);
                        setShowForm(true);
                      }}
                    >
                      Edit
                    </button>
                    <button
                      className="border px-2 py-1 rounded hover:bg-red-100 text-red-600"
                      onClick={() => handleDelete(banner.id!)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};
export default Page;
