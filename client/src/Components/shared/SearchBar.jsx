import { Search } from "lucide-react"
import { Input } from "../../Components/ui/input"

const SearchBar = ({ searchText, setSearchText, placeholder = "Search..." }) => {
      return (
            <div className="relative flex-grow">
                  <Search className="absolute left-3 text-gray-500 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
                  <Input
                        className="pl-10 border-gray-300 outline-none focus:outline-none focus:ring-gray-400"
                        placeholder={placeholder}
                        value={searchText}
                        onChange={(e) => setSearchText(e.target.value)}
                  />
            </div>
      )
}

export default SearchBar;