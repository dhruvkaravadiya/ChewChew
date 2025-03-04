import { Input } from "../../Components/ui/input"
import { Label } from "../../Components/ui/label"
export const FormInput = ({ label, id, type = "text", name, value, onChange, disabled = false, className = "" }) => {
      return (
            <div className="space-y-2">
                  <Label htmlFor={id}>{label}</Label>
                  <Input
                        type={type}
                        id={id}
                        name={name}
                        value={value}
                        onChange={onChange}
                        disabled={disabled}
                        className={`border-custom-gray-200 text-custom-gray-300 focus:outline-none focus:ring-custom-gray-200 ${className}`}
                  />
            </div>
      )
}
