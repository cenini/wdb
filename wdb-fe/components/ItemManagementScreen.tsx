import { View, Text, Button } from "react-native";
import { ItemModel } from "../models/ItemModel";

const ItemManagementScreen = ({
  item,
  onClose,
}: {
  item: ItemModel;
  onClose: any;
}) => {
  console.log(item);
  // {
  //   "id": "a074314e-c20b-4769-b1d7-2ecccaafd908",
  //   "ownerId": 1,
  //   "createdAt": "2023-12-18T14:45:46.409Z",
  //   "title": "Coral Textured Overcoat",
  //   "updatedAt": null,
  //   "photos": [
  //       {
  //           "id": "fc31278a-2c01-43c9-b4c2-7ccb22536312",
  //           "url": "https://res.cloudinary.com/dbf4lqbob/image/upload/v1702910746/vjjxmz9yvlhnyjxhqhhh.jpg",
  //           "itemId": "a074314e-c20b-4769-b1d7-2ecccaafd908",
  //           "createdAt": "2023-12-18T14:45:47.221Z",
  //           "updatedAt": null
  //       }
  //   ],
  //   "tags": []
  // }
  return (
    <View>
      <Text>{item.title}</Text>
      <Button onPress={onClose} title="Close" />
    </View>
  );
};

export default ItemManagementScreen;
