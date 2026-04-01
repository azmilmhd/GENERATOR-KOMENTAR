/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useRef, useCallback } from 'react';
import { toPng, toJpeg } from 'html-to-image';
import { 
  Camera, 
  Download, 
  Upload, 
  User, 
  MessageSquare, 
  ThumbsUp, 
  ThumbsDown,
  Heart, 
  MoreVertical,
  Facebook,
  Youtube,
  MessageCircle,
  Phone,
  Video,
  Paperclip,
  Smile,
  Mic,
  CheckCheck,
  ArrowLeft,
  Send,
  Trash2,
  Plus,
  Image as ImageIcon,
  Music
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

type Tab = 'fb' | 'youtube';
type Page = 'comments' | 'whatsapp' | 'tiktok' | 'shopee';

interface WAMessage {
  id: string;
  text: string;
  sender: 'me' | 'them';
  time: string;
  image?: string | null;
  status?: 'sent' | 'delivered' | 'read';
}

export default function App() {
  const [activePage, setActivePage] = useState<Page>('comments');
  const [activeTab, setActiveTab] = useState<Tab>('fb');
  
  // Common State
  const [name, setName] = useState('Fahnita Zahra');
  const [comment, setComment] = useState('Ambeienku udah stadium 2, benjolan anusnya itu kadang keluar tapi bisa masuk lagi. Bagusnya paket yang mana min biar nggak operasi?');
  const [profilePic, setProfilePic] = useState<string | null>(null);
  const [time, setTime] = useState('6 hr');
  const [likes, setLikes] = useState('23');
  const [replies, setReplies] = useState('17');
  const [isExporting, setIsExporting] = useState(false);

  // WhatsApp Specific State
  const [waStatus, setWaStatus] = useState('online');
  const [waBackground, setWaBackground] = useState<string | null>(null);
  const [waMessages, setWaMessages] = useState<WAMessage[]>([
    { id: '1', text: 'Assalammualaikum mbk.. mau tanya 🙏 klo sdh smbuh apa hrus ttp konsumsi ambeno atau boleh stop ya?? 🙏 Ini msih banyak stok soal nya..', sender: 'them', time: '03:46 PM' },
    { id: '2', text: 'Halo ibu 🥰🙏 Alhamdulillah keluhannya sudah teratasi... Kalau mau stop konsumsi boleh ya ibu, tapi saran saya lebih baik dilanjut konsumsi untuk pencegahan kumat lagi 🥰', sender: 'me', time: '03:59 PM', status: 'read' },
    { id: '3', text: 'Klo gitu saya lanjut konsumsi aja ya..', sender: 'them', time: '04:07 PM' },
    { id: '4', text: 'Alhamdulillah ibu 🥰🙏 apa boleh diceritakan apa saja perubahan setelah coba ikhtiar dengan Ambeno ibu? 🥰', sender: 'me', time: '04:32 PM', status: 'read' },
  ]);
  
  // Shopee Specific State
  const [shopeeRating, setShopeeRating] = useState(5);
  const [shopeeVariation, setShopeeVariation] = useState('Paket A');
  const [shopeeHelpful, setShopeeHelpful] = useState('0');
  const [shopeeImages, setShopeeImages] = useState<string[]>([]);
  
  const commentRef = useRef<HTMLDivElement>(null);

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const exportImage = useCallback(async (format: 'png' | 'jpeg') => {
    if (commentRef.current === null) return;
    
    setIsExporting(true);
    try {
      const options = { 
        cacheBust: true, 
        backgroundColor: activePage === 'whatsapp' ? '#ece5dd' : activePage === 'tiktok' ? null : '#ffffff',
        quality: 0.95
      };
      
      const dataUrl = format === 'png' 
        ? await toPng(commentRef.current, options)
        : await toJpeg(commentRef.current, options);
      
      const link = document.createElement('a');
      const filename = activePage === 'whatsapp' ? 'whatsapp-chat' : (activePage === 'tiktok' ? 'tiktok-stitch' : `comment-${activeTab}`);
      link.download = `${filename}.${format}`;
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error('Export failed', err);
    } finally {
      setIsExporting(false);
    }
  }, [commentRef, activeTab, activePage]);

  const handleTabChange = (tab: Tab) => {
    setActiveTab(tab);
    // Set some defaults based on tab
    if (tab === 'youtube') {
      setName('@shelfianimegasanthana9572');
      setComment('bnr kata keanu dgr tasya ngmg pegel ya😂');
      setTime('17 jam lalu');
      setLikes('113');
    } else {
      setName('Fahnita Zahra');
      setComment('Ambeienku udah stadium 2, benjolan anusnya itu kadang keluar tapi bisa masuk lagi. Bagusnya paket yang mana min biar nggak operasi?');
      setTime('6 hr');
      setLikes('23');
    }
  };

  const handlePageChange = (page: Page) => {
    setActivePage(page);
    if (page === 'whatsapp') {
      setName('Ibu Maya | Ambeno');
      setWaStatus('online');
    } else if (page === 'tiktok') {
      setName('username');
      setComment('kenaa ya kak kok perut aku sakit terus, terus tenggorokanku meradang dan juga kakiku sakit banget, trus setelah di gigit ular ularnya mati karena aku injak pake kaki');
    } else {
      setName('Fahnita Zahra');
      handleTabChange('fb');
    }
  };

  const addWaMessage = () => {
    const newMessage: WAMessage = {
      id: Date.now().toString(),
      text: 'Pesan baru...',
      sender: 'them',
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'read'
    };
    setWaMessages([...waMessages, newMessage]);
  };

  const updateWaMessage = (id: string, updates: Partial<WAMessage>) => {
    setWaMessages(waMessages.map(msg => msg.id === id ? { ...msg, ...updates } : msg));
  };

  const deleteWaMessage = (id: string) => {
    setWaMessages(waMessages.filter(msg => msg.id !== id));
  };

  const handleMessageImageChange = (id: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        updateWaMessage(id, { image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleWaBackgroundChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setWaBackground(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleShopeeImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          setShopeeImages(prev => [...prev, reader.result as string].slice(0, 3));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeShopeeImage = (index: number) => {
    setShopeeImages(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4 md:p-8 font-sans text-neutral-900">
      <div className="max-w-5xl mx-auto">
        
        {/* Header & Page Navigation */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <div>
            <h1 className="text-2xl font-bold text-neutral-800">Generator Konten</h1>
            <p className="text-neutral-500 text-sm">Buat gambar kustom untuk media sosial</p>
          </div>
          
          <div className="flex bg-neutral-200 p-1 rounded-xl w-fit">
            <button 
              onClick={() => handlePageChange('comments')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activePage === 'comments' ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-600 hover:text-neutral-800'}`}
            >
              <MessageSquare className="w-4 h-4" />
              Komentar Sosmed
            </button>
            <button 
              onClick={() => handlePageChange('whatsapp')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activePage === 'whatsapp' ? 'bg-white text-green-600 shadow-sm' : 'text-neutral-600 hover:text-neutral-800'}`}
            >
              <MessageCircle className="w-4 h-4" />
              WhatsApp Chat
            </button>
            <button 
              onClick={() => handlePageChange('tiktok')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activePage === 'tiktok' ? 'bg-white text-black shadow-sm' : 'text-neutral-600 hover:text-neutral-800'}`}
            >
              <Music className="w-4 h-4" />
              TikTok Stitch
            </button>
            <button 
              onClick={() => handlePageChange('shopee')}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activePage === 'shopee' ? 'bg-white text-orange-600 shadow-sm' : 'text-neutral-600 hover:text-neutral-800'}`}
            >
              <ImageIcon className="w-4 h-4" />
              Shopee Review
            </button>
          </div>
        </div>

        {activePage === 'comments' && (
          <div className="flex bg-neutral-100 p-1 rounded-lg w-fit mb-6">
            <button 
              onClick={() => handleTabChange('fb')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'fb' ? 'bg-white text-blue-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              <Facebook className="w-3.5 h-3.5" />
              Facebook
            </button>
            <button 
              onClick={() => handleTabChange('youtube')}
              className={`flex items-center gap-2 px-4 py-1.5 rounded-md text-xs font-bold transition-all ${activeTab === 'youtube' ? 'bg-white text-red-600 shadow-sm' : 'text-neutral-500 hover:text-neutral-700'}`}
            >
              <Youtube className="w-3.5 h-3.5" />
              YouTube
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          
          <motion.div 
            layout
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 rounded-2xl shadow-sm border border-neutral-200 space-y-6"
          >
            <div className="flex items-center gap-2 mb-2">
              {activePage === 'comments' ? (
                activeTab === 'fb' ? <Facebook className="w-5 h-5 text-blue-600" /> : <Youtube className="w-5 h-5 text-red-600" />
              ) : (
                <MessageCircle className="w-5 h-5 text-green-600" />
              )}
              <h2 className="text-xl font-semibold">
                Editor {activePage === 'comments' ? (activeTab === 'fb' ? 'Facebook' : 'YouTube') : activePage === 'whatsapp' ? 'WhatsApp' : activePage === 'tiktok' ? 'TikTok Stitch' : 'Shopee Review'}
              </h2>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">Foto Profil / Avatar</label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-full bg-neutral-100 flex items-center justify-center overflow-hidden border border-neutral-200">
                    {profilePic ? (
                      <img src={profilePic} alt="Preview" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    ) : (
                      <User className="w-8 h-8 text-neutral-400" />
                    )}
                  </div>
                  <label className="cursor-pointer bg-neutral-100 hover:bg-neutral-200 px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Upload Foto
                    <input type="file" className="hidden" accept="image/*" onChange={handleProfilePicChange} />
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-neutral-600 mb-1">Nama / Username</label>
                <input 
                  type="text" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder={activeTab === 'youtube' ? "@username" : "Nama lengkap..."}
                />
              </div>

              {activePage === 'comments' ? (
                <>
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">Komentar</label>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Tulis komentar..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 mb-1">Waktu</label>
                      <input 
                        type="text" 
                        value={time}
                        onChange={(e) => setTime(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Contoh: 6 hr atau 17 jam lalu"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 mb-1">Jumlah Like</label>
                      <input 
                        type="text" 
                        value={likes}
                        onChange={(e) => setLikes(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Contoh: 23"
                      />
                    </div>
                  </div>

                  {activeTab === 'youtube' && (
                    <div>
                      <label className="block text-sm font-medium text-neutral-600 mb-1">Jumlah Balasan</label>
                      <input 
                        type="text" 
                        value={replies}
                        onChange={(e) => setReplies(e.target.value)}
                        className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                        placeholder="Contoh: 17"
                      />
                    </div>
                  )}
                </>
              ) : activePage === 'whatsapp' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">Status (Online/Offline)</label>
                    <input 
                      type="text" 
                      value={waStatus}
                      onChange={(e) => setWaStatus(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                      placeholder="online"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">Background Chat</label>
                    <div className="flex items-center gap-2">
                      <label className="flex-1 cursor-pointer bg-neutral-50 border border-dashed border-neutral-300 rounded-lg p-3 hover:bg-neutral-100 transition-all flex flex-col items-center justify-center gap-1 group">
                        <ImageIcon className="w-5 h-5 text-neutral-400 group-hover:text-green-500" />
                        <span className="text-xs text-neutral-500">Upload Background</span>
                        <input type="file" className="hidden" accept="image/*" onChange={handleWaBackgroundChange} />
                      </label>
                      {waBackground && (
                        <button 
                          onClick={() => setWaBackground(null)}
                          className="text-xs text-red-500 hover:underline"
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="block text-sm font-medium text-neutral-600">Daftar Pesan Chat</label>
                      <button 
                        onClick={addWaMessage}
                        className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded hover:bg-green-200 transition-colors flex items-center gap-1"
                      >
                        <Plus className="w-3 h-3" /> Tambah Pesan
                      </button>
                    </div>

                    <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                      {waMessages.map((msg) => (
                        <div key={msg.id} className="p-3 border border-neutral-100 rounded-xl bg-neutral-50 space-y-3">
                          <div className="flex items-center justify-between">
                            <select 
                              value={msg.sender}
                              onChange={(e) => updateWaMessage(msg.id, { sender: e.target.value as 'me' | 'them' })}
                              className="text-xs font-semibold bg-white border border-neutral-200 rounded px-2 py-1 outline-none"
                            >
                              <option value="them">Penerima (Kiri)</option>
                              <option value="me">Saya (Kanan)</option>
                            </select>
                            <button 
                              onClick={() => deleteWaMessage(msg.id)}
                              className="text-red-500 hover:bg-red-50 p-1 rounded transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <textarea 
                            value={msg.text}
                            onChange={(e) => updateWaMessage(msg.id, { text: e.target.value })}
                            className="w-full text-sm px-3 py-2 rounded-lg border border-neutral-200 outline-none focus:ring-1 focus:ring-green-500 min-h-[60px]"
                            placeholder="Isi pesan..."
                          />

                          <div className="grid grid-cols-2 gap-2">
                            <input 
                              type="text" 
                              value={msg.time}
                              onChange={(e) => updateWaMessage(msg.id, { time: e.target.value })}
                              className="text-xs px-2 py-1 rounded border border-neutral-200"
                              placeholder="Waktu (09:00 AM)"
                            />
                            {msg.sender === 'me' && (
                              <select 
                                value={msg.status}
                                onChange={(e) => updateWaMessage(msg.id, { status: e.target.value as any })}
                                className="text-xs px-2 py-1 rounded border border-neutral-200"
                              >
                                <option value="sent">Terkirim (1 centang)</option>
                                <option value="delivered">Diterima (2 centang)</option>
                                <option value="read">Dibaca (Biru)</option>
                              </select>
                            )}
                          </div>

                          <div className="flex items-center gap-2">
                            <label className="cursor-pointer text-xs bg-white border border-neutral-200 px-2 py-1 rounded hover:bg-neutral-100 transition-colors flex items-center gap-1">
                              <ImageIcon className="w-3 h-3" />
                              {msg.image ? 'Ganti Gambar' : 'Tambah Gambar'}
                              <input type="file" className="hidden" accept="image/*" onChange={(e) => handleMessageImageChange(msg.id, e)} />
                            </label>
                            {msg.image && (
                              <button 
                                onClick={() => updateWaMessage(msg.id, { image: null })}
                                className="text-xs text-red-500"
                              >
                                Hapus Gambar
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : activePage === 'tiktok' ? (
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">Komentar TikTok</label>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={6}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 focus:ring-2 focus:ring-black focus:border-transparent outline-none transition-all resize-none"
                      placeholder="Tulis komentar stitch..."
                    />
                  </div>
                  <p className="text-xs text-neutral-400 italic">
                    * TikTok Stitch biasanya menampilkan komentar asli dengan font tebal dan besar.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">Rating (1-5)</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="5"
                      value={shopeeRating}
                      onChange={(e) => setShopeeRating(parseInt(e.target.value))}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 outline-none focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">Variasi</label>
                    <input 
                      type="text" 
                      value={shopeeVariation}
                      onChange={(e) => setShopeeVariation(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="Variasi: Paket A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">Ulasan</label>
                    <textarea 
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                      rows={4}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 outline-none focus:ring-2 focus:ring-orange-500 resize-none"
                      placeholder="Tulis ulasan..."
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">Jumlah Membantu</label>
                    <input 
                      type="text" 
                      value={shopeeHelpful}
                      onChange={(e) => setShopeeHelpful(e.target.value)}
                      className="w-full px-4 py-2 rounded-lg border border-neutral-200 outline-none focus:ring-2 focus:ring-orange-500"
                      placeholder="0"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-600 mb-1">Foto Ulasan (Maks 3)</label>
                    <div className="flex flex-wrap gap-2">
                      {shopeeImages.map((img, i) => (
                        <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden border border-neutral-200">
                          <img src={img} alt="" className="w-full h-full object-cover" />
                          <button 
                            onClick={() => removeShopeeImage(i)}
                            className="absolute top-0 right-0 bg-red-500 text-white p-0.5 rounded-bl-lg"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                      {shopeeImages.length < 3 && (
                        <label className="w-20 h-20 rounded-lg border-2 border-dashed border-neutral-300 flex flex-col items-center justify-center cursor-pointer hover:bg-neutral-50 transition-colors">
                          <Plus className="w-6 h-6 text-neutral-400" />
                          <input type="file" className="hidden" accept="image/*" multiple onChange={handleShopeeImageChange} />
                        </label>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 flex flex-wrap gap-3">
              <button 
                onClick={() => exportImage('png')}
                disabled={isExporting}
                className={`flex-1 min-w-[140px] text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50 ${
                  activePage === 'comments' 
                    ? (activeTab === 'fb' ? 'bg-blue-600 hover:bg-blue-700' : 'bg-red-600 hover:bg-red-700') 
                    : activePage === 'whatsapp' 
                      ? 'bg-green-600 hover:bg-green-700' 
                      : activePage === 'tiktok'
                        ? 'bg-black hover:bg-neutral-800'
                        : 'bg-orange-600 hover:bg-orange-700'
                }`}
              >
                <Download className="w-5 h-5" />
                Export PNG
              </button>
              <button 
                onClick={() => exportImage('jpeg')}
                disabled={isExporting}
                className="flex-1 min-w-[140px] bg-neutral-800 hover:bg-neutral-900 text-white px-6 py-3 rounded-xl font-semibold flex items-center justify-center gap-2 transition-all active:scale-95 disabled:opacity-50"
              >
                <Camera className="w-5 h-5" />
                Export JPG
              </button>
            </div>
          </motion.div>

          {/* Preview Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-semibold text-neutral-500 uppercase tracking-wider">Preview</h2>
              <span className="text-xs text-neutral-400">Tampilan akan sama dengan hasil export</span>
            </div>
            
            <motion.div 
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-4 md:p-8 rounded-2xl shadow-sm border border-neutral-200 flex items-center justify-center min-h-[400px]"
            >
              {/* The actual component to capture */}
              <div 
                ref={commentRef}
                className={`w-full max-w-[500px] ${activePage === 'whatsapp' ? 'bg-white rounded-none' : activePage === 'tiktok' ? 'bg-transparent overflow-visible p-4' : 'bg-white overflow-hidden p-8'}`}
                style={{ fontFamily: 'Roboto, Arial, sans-serif' }}
              >
                <AnimatePresence mode="wait">
                  {activePage === 'comments' ? (
                    activeTab === 'fb' ? (
                      <motion.div 
                        key="fb-preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-start gap-2"
                      >
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200">
                            {profilePic ? (
                              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400">
                                <User className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="bg-[#F0F2F5] rounded-[18px] px-3 py-2 inline-block max-w-full">
                            <div className="font-bold text-[15px] leading-tight hover:underline cursor-pointer">
                              {name}
                            </div>
                            <div className="text-[15px] leading-snug mt-0.5 whitespace-pre-wrap break-words">
                              {comment}
                            </div>
                          </div>

                          <div className="mt-1 flex items-center justify-between px-1">
                            <div className="flex items-center gap-4 text-[13px] font-bold text-[#65676B]">
                              <span className="font-normal">{time}</span>
                              <span className="hover:underline cursor-pointer">Suka</span>
                              <span className="hover:underline cursor-pointer">Balas</span>
                            </div>

                            <div className="flex items-center gap-1 bg-white shadow-sm rounded-full px-1 py-0.5 border border-neutral-100">
                              <div className="flex -space-x-1">
                                <div className="w-4 h-4 rounded-full bg-[#1877F2] flex items-center justify-center border border-white">
                                  <ThumbsUp className="w-2.5 h-2.5 text-white fill-white" />
                                </div>
                                <div className="w-4 h-4 rounded-full bg-[#F33E58] flex items-center justify-center border border-white">
                                  <Heart className="w-2.5 h-2.5 text-white fill-white" />
                                </div>
                              </div>
                              <span className="text-[13px] text-[#65676B] ml-0.5">{likes}</span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ) : (
                      <motion.div 
                        key="yt-preview"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="flex items-start gap-3"
                      >
                        <div className="flex-shrink-0">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200">
                            {profilePic ? (
                              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center bg-orange-700 text-white font-bold text-lg">
                                {name.charAt(1).toUpperCase() || 'S'}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-medium text-[13px] text-neutral-900">{name}</span>
                            <span className="text-[13px] text-neutral-500">• {time}</span>
                          </div>
                          
                          <div className="text-[14px] leading-relaxed text-neutral-900 whitespace-pre-wrap break-words">
                            {comment}
                          </div>

                          <div className="mt-3 flex items-center gap-4">
                            <div className="flex items-center gap-1.5">
                              <ThumbsUp className="w-[18px] h-[18px] text-neutral-900 cursor-pointer" />
                              <span className="text-[12px] text-neutral-600">{likes}</span>
                            </div>
                            <ThumbsDown className="w-[18px] h-[18px] text-neutral-900 cursor-pointer" />
                            <MessageSquare className="w-[18px] h-[18px] text-neutral-900 cursor-pointer" />
                          </div>

                          <div className="mt-4 flex items-center gap-2 text-blue-600 font-medium text-[14px] cursor-pointer hover:bg-blue-50 w-fit px-2 py-1 rounded-full transition-colors">
                            <span className="rotate-90">›</span>
                            <span>{replies} balasan</span>
                          </div>
                        </div>

                        <div className="flex-shrink-0">
                          <MoreVertical className="w-5 h-5 text-neutral-900 cursor-pointer" />
                        </div>
                      </motion.div>
                    )
                  ) : activePage === 'tiktok' ? (
                    <motion.div 
                      key="tiktok-preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="relative inline-block"
                    >
                      <div className="bg-white rounded-[24px] p-4 shadow-sm min-w-[280px] max-w-[320px] relative">
                        <div className="flex items-center gap-1 mb-1">
                          <span className="text-[13px] font-bold text-neutral-900">Membalas ke {name}</span>
                        </div>
                        <div className="text-[15px] leading-snug text-neutral-900 whitespace-pre-wrap break-words font-normal">
                          {comment}
                        </div>
                        
                        {/* Bubble Tail - Integrated at bottom left */}
                        <div className="absolute -bottom-[10px] left-[24px] w-0 h-0 border-l-[12px] border-l-transparent border-r-[12px] border-r-transparent border-t-[12px] border-t-white"></div>
                      </div>
                    </motion.div>
                  ) : activePage === 'whatsapp' ? (
                    <motion.div 
                      key="wa-preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="flex flex-col h-[650px] w-full relative"
                      style={{ 
                        backgroundColor: '#ece5dd',
                        backgroundImage: waBackground ? `url("${waBackground}")` : 'url("https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png")',
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}
                    >
                      {/* WA Header */}
                      <div className="bg-white text-neutral-900 p-3 flex items-center justify-between shadow-sm z-10 border-b border-neutral-100">
                        <div className="flex items-center gap-2">
                          <ArrowLeft className="w-6 h-6 text-neutral-700" />
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200 border border-neutral-100">
                            {profilePic ? (
                              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-neutral-400 bg-neutral-100">
                                <User className="w-6 h-6" />
                              </div>
                            )}
                          </div>
                          <div className="flex flex-col">
                            <span className="font-semibold text-[16px] leading-tight truncate max-w-[150px]">{name}</span>
                            <span className="text-[12px] text-neutral-500">{waStatus}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-5 pr-1">
                          <Video className="w-6 h-6 text-neutral-700" />
                          <Phone className="w-5 h-5 text-neutral-700" />
                          <MoreVertical className="w-6 h-6 text-neutral-700" />
                        </div>
                      </div>

                      {/* Chat Area */}
                      <div className="flex-1 overflow-y-auto p-4 space-y-3 custom-scrollbar relative">
                        <div className="flex justify-center my-2">
                          <span className="bg-white/80 backdrop-blur-sm text-[#54656F] text-[11px] px-2 py-1 rounded-md shadow-sm uppercase font-medium">Hari Ini</span>
                        </div>

                        {waMessages.map((msg) => (
                          <div 
                            key={msg.id} 
                            className={`flex ${msg.sender === 'me' ? 'justify-end' : 'justify-start'} mb-1`}
                          >
                            <div 
                              className={`max-w-[85%] rounded-lg p-1.5 shadow-sm relative ${
                                msg.sender === 'me' 
                                  ? 'bg-[#E7FFDB] rounded-tr-none' 
                                  : 'bg-white rounded-tl-none'
                              }`}
                            >
                              {/* Tail for Me */}
                              {msg.sender === 'me' && (
                                <div className="absolute top-0 -right-1.5 w-3 h-3 overflow-hidden">
                                  <div className="bg-[#E7FFDB] w-full h-full rotate-45 -translate-x-1/2 -translate-y-1/2"></div>
                                </div>
                              )}
                              {/* Tail for Them */}
                              {msg.sender === 'them' && (
                                <div className="absolute top-0 -left-1.5 w-3 h-3 overflow-hidden">
                                  <div className="bg-white w-full h-full rotate-45 translate-x-1/2 -translate-y-1/2"></div>
                                </div>
                              )}

                              {msg.image && (
                                <div className="mb-1 rounded overflow-hidden">
                                  <img src={msg.image} alt="Chat" className="w-full max-h-[300px] object-cover" referrerPolicy="no-referrer" />
                                </div>
                              )}
                              <div className="text-[14.5px] leading-relaxed whitespace-pre-wrap break-words pr-14 pl-1 pb-1 text-[#111b21]">
                                {msg.text}
                              </div>
                              <div className="absolute bottom-1 right-1.5 flex items-center gap-1">
                                <span className="text-[10px] text-[#667781]">{msg.time}</span>
                                {msg.sender === 'me' && (
                                  <CheckCheck className={`w-3.5 h-3.5 ${msg.status === 'read' ? 'text-[#53bdeb]' : 'text-[#8696a0]'}`} />
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* WA Footer */}
                      <div className="p-2 flex items-center gap-2 bg-transparent z-10 mb-1">
                        <div className="flex-1 bg-white rounded-full px-3 py-2 flex items-center gap-3 shadow-sm border border-neutral-100">
                          <Smile className="w-6 h-6 text-[#8696a0]" />
                          <div className="flex-1 text-[16px] text-[#8696a0]">Message</div>
                          <div className="flex items-center gap-4">
                            <Paperclip className="w-6 h-6 text-[#8696a0] -rotate-45" />
                            <Camera className="w-6 h-6 text-[#8696a0]" />
                          </div>
                        </div>
                        <div className="w-12 h-12 rounded-full bg-[#00a884] flex items-center justify-center shadow-md">
                          <Mic className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </motion.div>
                  ) : (
                    <motion.div 
                      key="shopee-preview"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      className="bg-white p-4 w-full max-w-[600px] shadow-sm"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full overflow-hidden bg-neutral-200">
                            {profilePic ? (
                              <img src={profilePic} alt="Profile" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                            ) : (
                              <User className="w-6 h-6 text-neutral-400" />
                            )}
                          </div>
                          <span className="text-[16px] font-medium text-[#222]">{name}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[#888] text-[14px]">
                          <span>Membantu ({shopeeHelpful})</span>
                          <ThumbsUp className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="flex gap-0.5 mb-2">
                        {[...Array(5)].map((_, i) => (
                          <svg 
                            key={i} 
                            className={`w-4 h-4 ${i < shopeeRating ? 'text-[#ee4d2d] fill-[#ee4d2d]' : 'text-neutral-200 fill-neutral-200'}`} 
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </svg>
                        ))}
                      </div>

                      <div className="text-[14px] text-[#888] mb-3">
                        Variasi: {shopeeVariation}
                      </div>

                      <div className="text-[15px] text-[#222] leading-relaxed mb-4 whitespace-pre-wrap">
                        {comment}
                      </div>

                      <div className="grid grid-cols-3 gap-2">
                        {shopeeImages.map((img, i) => (
                          <div key={i} className="aspect-square rounded-lg overflow-hidden relative group">
                            <img src={img} alt="" className="w-full h-full object-cover" />
                            {i === 0 && (
                              <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center">
                                <div className="absolute bottom-2 left-2 flex items-center gap-1 text-white">
                                  <div className="flex items-end gap-[1px] h-3">
                                    <div className="w-[2px] h-1 bg-white"></div>
                                    <div className="w-[2px] h-3 bg-white"></div>
                                    <div className="w-[2px] h-2 bg-white"></div>
                                  </div>
                                </div>
                                <div className="absolute bottom-2 right-2 text-white text-[12px]">0:05</div>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
      
      <footer className="mt-12 text-center text-neutral-400 text-sm">
        <p>© 2026 Generator Konten. Dibuat untuk kemudahan editing.</p>
      </footer>
    </div>
  );
}
