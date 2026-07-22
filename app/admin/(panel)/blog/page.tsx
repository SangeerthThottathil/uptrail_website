import { getPosts } from '@/lib/store/store'
import { savePosts } from '@/app/admin/actions/content'
import { CollectionEditor } from '@/components/admin/collection-editor'
import type { Post } from '@/lib/store/types'

export const dynamic = 'force-dynamic'

export default async function BlogPage() {
  const items = await getPosts()

  return (
    <CollectionEditor<Post>
      title="Blog posts"
      description="Articles shown on the insights/blog section."
      initial={items}
      titleKey="title"
      template={{
        slug: '',
        title: '',
        excerpt: '',
        category: '',
        date: '',
        readingTime: '',
        author: '',
        image: '',
        bodyContent: '',
        isFeatured: false,
      }}
      columns={[
        { key: 'title', label: 'Title (Plain Text)', placeholder: 'How to break into product management', full: true },
        { key: 'slug', label: 'Slug (URL)', placeholder: 'break-into-product-management' },
        { key: 'category', label: 'Category', placeholder: 'Career advice' },
        { key: 'excerpt', label: 'Excerpt (Short summary for previews/cards)', type: 'textarea', full: true, placeholder: 'One or two sentence summary shown on list/card previews.' },
        { key: 'image', label: 'Thumbnail Image (Card & Article Header)', type: 'upload', accept: 'image/*', full: true, placeholder: '/images/blog-pm.png' },
        { key: 'bodyContent', label: 'Body Content (Full Article Rich Text Editor)', type: 'richtext', full: true },
        { key: 'author', label: 'Author', placeholder: 'Jordan Ellis' },
        { key: 'date', label: 'Date', placeholder: 'Mar 12, 2025' },
        { key: 'readingTime', label: 'Reading time', placeholder: '6 min read' },
        { key: 'isFeatured', label: 'Featured Article (Highlighted on Blog Main Page)', type: 'boolean' },
      ]}
      onSave={savePosts}
    />
  )
}
