import { IconButton, Text } from "react-native-paper";
import styles from "../styles";

export interface BackButtonProps{
    onBack?: () => void;
    fontSize?: number;
    iconSize?: number;
}

export function BackButton(props: BackButtonProps){
    return (
        <IconButton
            icon={() => <Text style={{ color: 'white', fontSize: props.fontSize ?? 24 }}>{'<'}</Text>}
            size={props.iconSize ?? 32}
            onPress={props.onBack}
            style={[
                {
                    width: 40,
                    height: 40,
                },
                styles.rounded2,
                styles.justifyCenter,
                styles.alignItemsCenter,
                styles.bgDanger,
            ]}
        />
    );
}

export default BackButton;