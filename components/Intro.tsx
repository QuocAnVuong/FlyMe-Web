import Image from "next/image";

export default function IntroPage() {
  return (
    <div className="relative h-full w-full flex items-center justify-center">
      {/* Blurred Background Image */}
      <Image
        src="/Demo/Background.jpg"
        alt="Background"
        fill
        priority
        className="object-cover object-bottom blur-xs brightness-90"
      />

      {/* Overlay tint to enhance text readability */}
      <div className="absolute inset-0 bg-black/20" />

      {/* Content block */}
      <div className="relative max-w-3xl bg-white/30 backdrop-blur-md shadow-lg p-10 rounded-2xl space-y-6 text-center z-10">
        <h1 className="text-4xl md:text-5xl font-bold text-white drop-shadow-lg">
          <span className="text-blue-300">FlyMe </span>– KỂ CHUYỆN BẰNG HÌNH ẢNH
        </h1>

        <p className="text-lg md:text-xl text-white/90 leading-relaxed">
          Từ những khoảnh khắc rực rỡ của tuổi trẻ đến ngày hạnh phúc nhất đời,
          chúng tôi đồng hành cùng bạn qua từng cột mốc quan trọng.
        </p>

        <p className="text-lg md:text-xl text-white/90 leading-relaxed">
          Với hơn 6 kinh nghiệm, <span className="text-blue-300">FlyMe </span>{" "}
          mang đến dịch vụ chụp ảnh kỷ yếu và chụp ảnh cưới chuyên nghiệp, sáng
          tạo và đầy cảm xúc.
        </p>

        <p className="text-lg md:text-xl text-white/90 leading-relaxed">
          Chúng tôi tin rằng mỗi khách hàng đều có một câu chuyện đẹp và xứng
          đáng được lưu giữ theo một cách đặc biệt. Và nhiệm vụ của chúng tôi là
          biến những khoảnh khắc ấy thành ký ức sống mãi theo thời gian.
        </p>
      </div>
    </div>
  );
}
