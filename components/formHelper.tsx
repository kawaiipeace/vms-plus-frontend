interface FormHelper{
    text: string;
    icon?: string;
}
export default function FormHelper({text, icon}: FormHelper){
    return (
        <span className="form-helper text-error"> { icon && <i className="material-symbols-outlined icon-settings-fill-300-20">icon</i> } {text}</span>
    );
}