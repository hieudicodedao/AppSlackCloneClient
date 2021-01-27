# API folder

Index.js : Lưu trữ các thao tác với FETCH API để gọi API phía Server : POST , GET

# Components

+Login : Cho phép người dùng đăng nhập vào hệ thống , phía React kiểm tra USERNAME và PASSWORD ít nhất 7 kí tự trước khi thực hiện gọi API , nếu không đúng thì sẽ báo lỗi mà chưa cần xử lý phía SERVER .Nếu SERVER trả về kết quả đăng nhập chính xác sẽ set Token đăng nhập cho trình duyệt người dùng và điều hướng sang trang chủ Slack , ngược lại sẽ thông báo lỗi.Khi ấn vào Register sẽ điều hướng sang trang đăng kí

+Register : Username , Password , Retype Password , Fill Image is must. Client sẽ kiểm tra Username và Password ít nhất 7 kí tự và Retype Pass phải trùng với Password. Tệp đính kèm phải là định dạng img. Sau đó sẽ gọi API lên Server để kiểm tra tài khoản đã tồn tạo hay chưa, sau đó, nếu tạo thành công sẽ điều hướng về trang Login , trùng username thì báo lỗi ở nguyên trang hiện tại

+WrapMain : Hoạt động như 1 middleware phía Client , gọi API kiểm tra JSONTOKEN username để phát hiện xem người dùng đã đăng nhập trước đó hay chưa. Nếu đã đăng nhập cho phép vào trang chính của Slack, ngược lại cho về trang Login

+Main : Thực hiện các hành động chính của các chức năng Slack .Khi bắt đầu nó sẽ khởi tạo 1 Socket instance , tải các channel đang hoạt động thông qua gọi API

+MainChannel : có 2 chức năng chính : tham gia vào 1 channel đã có sẵn bằng việc ấn vào tên của channel - tạo mới 1 channel .Cả 2 hành động sẽ chuyển về Main để xử lý . Khi hành động tạo phòng sẽ gọi lên Server để tạo channel và trả về kết quả nếu tạo thành công thì cho người dùng vào trong channel . Hành động tham gia phòng sẽ được gọi API để lấy danh sách các topic của channel đó về bộ nhớ của Component Main sau đó sẽ render ra sau

+MainStatus : nhập được số lượng post và tên channel được gửi từ Main sau đó Render ra

+MainTopic : nhập được từ Main 1 mảng các topic và render ra . khi nhập 1 tin nhắn text và ảnh sẽ chuyển vào components Main để thực hiện gọi API

+MainThread : được truyền vào là 1 mảng các reply khi ấn vào replies trong mỗi topic

# Config : Lưu lại các đường dẫn để trỏ tới API của Server
