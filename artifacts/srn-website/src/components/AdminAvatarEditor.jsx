import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { Dialog, DialogContent, DialogTitle, DialogDescription } from './ui/dialog';

export default function AdminAvatarEditor({ target, onUpdated, onClose }) {
  const { user, API_BASE } = useAuth();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  useEffect(() => {
    setPreview('');
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => setPreview(String(reader.result));
    reader.readAsDataURL(file);
    return () => { if (reader.readyState === FileReader.LOADING) reader.abort(); };
  }, [file]);
  if (user?.role !== 'ADMIN') return null;

  const save = async event => {
    event.preventDefault();
    if (!file || busy) return;
    setBusy(true); setError(''); setMessage('');
    try {
      const body = new FormData();
      body.append('avatar', file);
      const response = await fetch(`${API_BASE}/api/admin/users/${target.id}/avatar`, {
        method: 'PATCH', credentials: 'include', body,
        headers: { Authorization: `Bearer ${localStorage.getItem('accessToken')}` },
      });
      if (!response.headers.get('content-type')?.includes('application/json')) {
        if (response.status === 404) throw new Error('The server does not support profile image updates yet. The backend needs to be deployed with the latest changes.');
        if (response.status === 413) throw new Error('The server rejected the image size. Please choose a smaller image and try again.');
        throw new Error(`The upload service is temporarily unavailable (HTTP ${response.status}). Please try again shortly.`);
      }
      let result;
      try { result = await response.json(); }
      catch { throw new Error('The server returned an invalid upload response. Please try again shortly.'); }
      if (!response.ok) throw new Error(result?.message || 'Failed to update profile image');
      if (!result?.data?.avatar) throw new Error('The server returned an invalid upload response. Please try again shortly.');
      onUpdated(result.data);
      setFile(null);
      setMessage(result.data.idCardWarning || 'Profile image updated successfully.');
    } catch (err) { setError(err.message); }
    finally { setBusy(false); }
  };

  return (
    <Dialog open onOpenChange={open => { if (!open && !busy) onClose(); }}>
      <DialogContent onEscapeKeyDown={event => { if (busy) event.preventDefault(); }} onInteractOutside={event => { if (busy) event.preventDefault(); }}>
        <DialogTitle>Update Profile Image</DialogTitle>
        <DialogDescription>{target.firstName} {target.lastName} · {target.email}. PNG or JPEG, up to 5 MB and 4096 × 4096 pixels.</DialogDescription>
        <form onSubmit={save} className="space-y-4">
          {(preview || target.avatar) && <img src={preview || target.avatar} alt="Selected user" className="w-32 h-32 rounded-xl object-cover mx-auto" />}
          <label className="block text-sm font-bold">New profile image
            <input type="file" accept="image/png,image/jpeg" disabled={busy} className="block mt-2 w-full" onChange={event => {
              const selected = event.target.files?.[0];
              setError(''); setMessage(''); setFile(null);
              if (!selected) return;
              if (!['image/png', 'image/jpeg'].includes(selected.type) || selected.size > 5 * 1024 * 1024) {
                setError('Choose a PNG or JPEG image no larger than 5 MB.');
                event.target.value = '';
                return;
              }
              setFile(selected);
            }} />
          </label>
          {error && <p role="alert" className="text-sm text-red-700">{error}</p>}
          {message && <p role="status" className="text-sm text-emerald-800">{message}</p>}
          <p className="text-xs text-gray-600">Active members’ ID cards are refreshed with the new photo.</p>
          <div className="flex gap-3">
            <button type="submit" disabled={!file || busy} className="bg-[#E8622A] text-white rounded-xl px-4 py-2 font-bold disabled:opacity-50">{busy ? 'Saving…' : 'Save Profile Image'}</button>
            <button type="button" disabled={busy} onClick={onClose} className="border rounded-xl px-4 py-2">Close</button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
