import { useEffect, useRef, useState } from "react"
import { supabase } from "../lib/supabase"

type Workshop = {
  id: string
  title: string
  description: string
  date: string
  capacity: number
  image: string | null
}

export default function Admin() {
  const [workshops, setWorkshops] = useState<Workshop[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [editing, setEditing] = useState<Workshop | null>(null)

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [date, setDate] = useState("")
  const [capacity, setCapacity] = useState(10)
  const [file, setFile] = useState<File | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const preview = file
    ? URL.createObjectURL(file)
    : editing?.image || null

  useEffect(() => {
    const fetchWorkshops = async () => {
      const { data } = await supabase
        .from("workshops")
        .select("*")
        .order("date")

      setWorkshops(data || [])
      setLoading(false)
    }

    fetchWorkshops()
  }, [])

  // 🖼 subir imagen
  const uploadImage = async (file: File, id: string) => {
    const fileName = `${id}-${Date.now()}.jpg`

    const { error } = await supabase.storage
      .from("workshops")
      .upload(fileName, file, { upsert: true })

    if (error) {
      console.error("UPLOAD ERROR:", error)
      return null
    }

    const { data } = supabase.storage
      .from("workshops")
      .getPublicUrl(fileName)

    return data.publicUrl
  }

  const resetForm = () => {
    setTitle("")
    setDescription("")
    setDate("")
    setCapacity(10)
    setFile(null)
    setEditing(null)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (saving) return

    setSaving(true)

    try {
      // ✏️ EDITAR
      if (editing) {
        let imageUrl = editing.image

        if (file) {
          imageUrl = await uploadImage(file, editing.id)
        }

        await supabase
          .from("workshops")
          .update({
            title,
            description,
            date,
            capacity,
            image: imageUrl,
          })
          .eq("id", editing.id)

        setWorkshops((prev) =>
          prev.map((w) =>
            w.id === editing.id
              ? { ...w, title, description, date, capacity, image: imageUrl }
              : w
          )
        )

        resetForm()
      }

      // ➕ CREAR
      else {
        const { data, error } = await supabase
          .from("workshops")
          .insert([
            { title, description, date, capacity }
          ])
          .select()
          .single()

        if (error || !data) {
          console.error("INSERT ERROR:", error)
          setSaving(false)
          return
        }

        let imageUrl: string | null = null

        if (file) {
          imageUrl = await uploadImage(file, data.id)

          if (imageUrl) {
            await supabase
              .from("workshops")
              .update({ image: imageUrl })
              .eq("id", data.id)
          }
        }

        setWorkshops((prev) => [
          ...prev,
          { ...data, image: imageUrl },
        ])

        resetForm()
      }
    } catch (err) {
      console.error("ERROR:", err)
    }

    setSaving(false)
  }

  const handleEdit = (w: Workshop) => {
    setEditing(w)
    setTitle(w.title)
    setDescription(w.description)
    setDate(w.date)
    setCapacity(w.capacity)
    setFile(null)
  }

  const handleDelete = async (id: string) => {
    if (!confirm("Eliminar?")) return

    await supabase.from("workshops").delete().eq("id", id)

    setWorkshops((prev) => prev.filter((w) => w.id !== id))
  }

  if (loading) return <p className="mt-20 text-center">Cargando...</p>

  return (
    <div className="max-w-5xl mx-auto px-6 space-y-10">
      <h1 className="text-3xl font-display">Panel Admin</h1>

      {/* FORM */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-5 rounded-xl border space-y-4"
      >
        <h2>{editing ? "Editar" : "Crear"} taller</h2>

        <input
          className="w-full p-2 border"
          placeholder="Título"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />

        <textarea
          className="w-full p-2 border"
          placeholder="Descripción"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
        />

        <input
          type="date"
          className="w-full p-2 border"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          required
        />

        <input
          type="number"
          className="w-full p-2 border"
          value={capacity}
          onChange={(e) => setCapacity(Number(e.target.value))}
        />

        {/* FILE */}
        <div
          onClick={() => fileInputRef.current?.click()}
          className="border p-4 text-center cursor-pointer"
        >
          Subir imagen
          <input
            ref={fileInputRef}
            type="file"
            hidden
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) setFile(f)
            }}
          />
        </div>

        {preview && (
          <img src={preview} className="h-40 object-cover" />
        )}

        <button
          disabled={saving}
          className="border px-4 py-2 rounded"
        >
          {saving ? "Guardando..." : "Guardar"}
        </button>
      </form>

      {/* LISTA */}
      {workshops.map((w) => (
        <div
          key={w.id}
          className="bg-white p-4 border flex justify-between"
        >
          <div>
            <p>{w.title}</p>
            <p className="text-sm">{w.date}</p>
          </div>

          <div className="flex gap-2">
            <button onClick={() => handleEdit(w)}>Editar</button>
            <button onClick={() => handleDelete(w.id)}>Eliminar</button>
          </div>
        </div>
      ))}
    </div>
  )
}