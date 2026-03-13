export default function generateRoomCode(length: number = 4): string {
  // We exclude confusing characters like O, 0, I, 1
  const alphabet = "ABCDEFGHJKLMNPQRSTUVWXYZ"; 
  let code = "";
  
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * alphabet.length);
    code += alphabet[randomIndex];
  }
  
  return code;
}
