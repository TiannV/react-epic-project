import { createClient } from '@supabase/supabase-js'
const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

const Auth = {
  async register(email, password) {
    let { user, error } = await supabase.auth.signUp({ email, password })
    console.log(error)
    if (error) throw error
    console.log(user)
    return user
  },

  async login(email, password) {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data.user
  },

  async logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  async getCurrentUser() {
    const { data: { user } } = await supabase.auth.getUser()
    console.log(user)
    return user
  }
}

const Uploader = {
  async add(file, filename) {
    const { data: { user } } = await supabase.auth.getUser()
    console.log(user)
    let user_id = ''
    let f = ''
    if (user) {
        user_id = user.id
        f = user.id + '/'
    } else {
        user_id = 'anon'
        f = 'public/'
    }

    filename = f+filename
    let { data, error } = await supabase.storage.from('images').upload(filename, file, {upsert: true})
    if (error) {
        console.log(error)
        throw error
    }

    const { data: {publicUrl} } = supabase.storage.from('images').getPublicUrl(filename)

    const { data: exit, error:error0 } = await supabase
      .from('images')
      .select()
      .eq('filename', filename)
   
    console.log(exit) 
    if (exit.length !== 0) {
	const { error: error1 } = await supabase
	  .from('images')
	  .update({'url': publicUrl})
	  .eq('filename', filename)
        if (error1) throw error1
    } else {	    
        const { data: dbData, error: dbError } = await supabase.from('images').insert([
          { filename, owner_id: user_id, url: publicUrl }
        ])
        if (dbError) throw dbError
        return dbData
    }
  },

  async find({ page = 0, limit = 10 }) {
    const { data: { user } } = await supabase.auth.getUser()
    let user_id = ''
    if (user) {
        user_id = user.id
    } else {
        user_id = 'anon'
    }

    const { data, error } = await supabase.from('images')
      .select('id, filename, url, created_at')
      .eq('owner_id', user_id)
      .range(page * limit, (page + 1) * limit - 1)
      .order('created_at', { ascending: false })
    if (error) throw error
    return data
  },

  async deleteItem(id) {
    const { data: imageData, error: imageError } = await supabase.from('images').select('filename').eq('id', id).single()
    if (imageError) throw imageError

    const { error: storageError } = await supabase.storage.from('images').remove([imageData.filename])
    if (storageError) throw storageError

    const { data, error } = await supabase.from('images').delete().eq('id', id)
    if (error) throw error
    return data
  }
}

window.Uploader = Uploader

export {
  Auth,
  supabase,
  Uploader
}
