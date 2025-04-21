import './styles/InfoMakerLabelInput.css'

interface InfoMakerLabelInputProps {
    label: string
    value: string
    placeholder: string
    onChange: (e: any) => void
    validation?: "error" | "alert" | "success";
    message?: string | null
}

export default function InfoMakerLabelInput({label, value, placeholder, onChange, validation, message} : InfoMakerLabelInputProps) {
    return (
        <form className='info-maker-label-form'>
            <label>
                {label}
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e)}
                    className="info-maker-label-input"
                    placeholder={placeholder}
                />
                {message && (
                    <small
                        className={`info-maker-label ${validation}`}
                    >
                        {message}
                    </small>
                )}
            </label>
        </form>
    )
}