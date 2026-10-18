import { useParams } from 'react-router-dom'
import { deviceCategories } from '@/data/booking'
import { getIssuePage } from '@/data/issueCatalog'
import { isGenericModel, slugify } from '@/lib/slugify'
import { getSeoPageByPath } from '@/data/seoCatalog'
import ModelHubPage from '@/pages/ModelHubPage'
import NotFound from '@/pages/NotFound'
import RepairIssuePage from '@/pages/RepairIssuePage'
import SeoEntityPage from '@/pages/SeoEntityPage'

export function RepairCategoryPage() {
  const { categoryId } = useParams<{ categoryId: string }>()
  const page = getSeoPageByPath(`/repair/${categoryId}`)
  if (!page) return <NotFound />
  return <SeoEntityPage page={page} />
}

export function RepairBrandPage() {
  const { categoryId, brandId } = useParams<{ categoryId: string; brandId: string }>()
  const page = getSeoPageByPath(`/repair/${categoryId}/${brandId}`)
  if (!page) return <NotFound />
  return <SeoEntityPage page={page} />
}

export function RepairModelPage() {
  const { categoryId, brandId, modelSlug } = useParams<{
    categoryId: string
    brandId: string
    modelSlug: string
  }>()
  const page = getSeoPageByPath(`/repair/${categoryId}/${brandId}/${modelSlug}`)
  const category = deviceCategories.find((item) => item.id === categoryId)
  const brand = category?.brands.find((item) => item.id === brandId)
  const model = brand?.models.find((item) => slugify(item) === modelSlug && !isGenericModel(item))
  if (!page || !category || !brand || !model) return <NotFound />
  return (
    <ModelHubPage
      page={page}
      categoryId={category.id}
      brandId={brand.id}
      model={model}
      brandLabel={brand.label}
    />
  )
}

export function RepairIssueRoute() {
  const { categoryId, brandId, modelSlug, issueSlug } = useParams<{
    categoryId: string
    brandId: string
    modelSlug: string
    issueSlug: string
  }>()
  const page = getIssuePage(`/repair/${categoryId}/${brandId}/${modelSlug}/${issueSlug}`)
  if (!page) return <NotFound />
  return <RepairIssuePage page={page} />
}

export function ProductSeoPage() {
  const { productSlug } = useParams<{ productSlug: string }>()
  const page = getSeoPageByPath(`/products/${productSlug}`)
  if (!page) return <NotFound />
  return <SeoEntityPage page={page} />
}

export function RecyclingTopicPage() {
  const { topicSlug } = useParams<{ topicSlug: string }>()
  const page = getSeoPageByPath(`/recycling/${topicSlug}`)
  if (!page) return <NotFound />
  return <SeoEntityPage page={page} />
}
