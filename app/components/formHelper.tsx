interface FormHelper{
    text: string;
}
export default function FormHelper({text}: FormHelper){
    return (
        <span className="form-helper text-error">{text}</span>
    );
}