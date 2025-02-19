import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const SortSelect = ({ sortBy, setSortBy, options }) => {
  return (
    <Select value={sortBy} onValueChange={setSortBy} className="border-custom-gray-100">
      <SelectTrigger className="w-full md:w-[180px] border-custom-gray-100 focus:ring-gray-400 shadow-none">
        <SelectValue placeholder="Sort by" />
      </SelectTrigger>
      <SelectContent className="w-full md:w-[180px] border-custom-gray-100">
        {options.map(({ value, label }) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  )
}

export default SortSelect
