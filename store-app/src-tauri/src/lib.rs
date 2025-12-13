use std::{fs, path::PathBuf};

#[tauri::command]
async fn download_app(app_dir: String, url: String, filename: String) -> Result<(), String> {
    // Ensure folder exists
    fs::create_dir_all(&app_dir).map_err(|e| e.to_string())?;

    // Full path for the file
    let file_path: PathBuf = PathBuf::from(app_dir).join(&filename);

    // Download via reqwest
    let bytes = reqwest::get(&url)
        .await
        .map_err(|e| e.to_string())?
        .bytes()
        .await
        .map_err(|e| e.to_string())?;

    // Write file
    fs::write(&file_path, &bytes).map_err(|e| e.to_string())?;

    Ok(())
}

#[tauri::command]
fn uninstall_app(app_dir: String, app_name: String) -> Result<(), String> {
    let app_json_path = PathBuf::from(&app_dir).join(format!("{}_app.json", app_name));
    fs::remove_file(&app_json_path).map_err(|e| e.to_string())?;
    let app_exe_path = PathBuf::from(&app_dir).join(format!("{}.exe", app_name));
    fs::remove_file(&app_exe_path).map_err(|e| e.to_string())?;
    Ok(())
}

#[tauri::command]
fn ensure_dir_on_user_path(dir: String) -> Result<bool, String> {
    ensure_dir_on_user_path_impl(&dir)
}

#[cfg(windows)]
fn ensure_dir_on_user_path_impl(dir: &str) -> Result<bool, String> {
    use std::ffi::OsStr;
    use std::os::windows::ffi::OsStrExt;

    use winreg::enums::{HKEY_CURRENT_USER, KEY_READ, KEY_WRITE};
    use winreg::RegKey;

    use windows_sys::Win32::Foundation::{HWND, LPARAM, WPARAM};
    use windows_sys::Win32::UI::WindowsAndMessaging::{
        SendMessageTimeoutW, HWND_BROADCAST, SMTO_ABORTIFHUNG, WM_SETTINGCHANGE,
    };

    let hkcu = RegKey::predef(HKEY_CURRENT_USER);
    let (env, _) = hkcu
        .create_subkey("Environment")
        .map_err(|e| e.to_string())?;
    let env = env
        .open_subkey_with_flags("", KEY_READ | KEY_WRITE)
        .map_err(|e| e.to_string())?;

    let current: String = env.get_value("Path").unwrap_or_default();
    let desired = dir.trim().trim_end_matches('\\').to_lowercase();

    let already_present = current
        .split(';')
        .map(|s| s.trim().trim_end_matches('\\').to_lowercase())
        .any(|s| !s.is_empty() && s == desired);

    if already_present {
        return Ok(false);
    }

    let mut new_path = current.trim().to_string();
    if !new_path.is_empty() && !new_path.ends_with(';') {
        new_path.push(';');
    }
    new_path.push_str(dir);

    env.set_value("Path", &new_path)
        .map_err(|e| e.to_string())?;

    // Broadcast environment change so new processes can pick it up
    let env_w: Vec<u16> = OsStr::new("Environment")
        .encode_wide()
        .chain(Some(0))
        .collect();
    unsafe {
        let _ = SendMessageTimeoutW(
            HWND_BROADCAST as HWND,
            WM_SETTINGCHANGE,
            0 as WPARAM,
            env_w.as_ptr() as LPARAM,
            SMTO_ABORTIFHUNG,
            2000,
            std::ptr::null_mut(),
        );
    }

    Ok(true)
}

#[cfg(not(windows))]
fn ensure_dir_on_user_path_impl(_dir: &str) -> Result<bool, String> {
    Ok(false)
}

#[cfg_attr(mobile, tauri::mobile_entry_point)]
pub fn run() {
    tauri::Builder::default()
        .plugin(tauri_plugin_fs::init())
        .plugin(tauri_plugin_opener::init())
        .invoke_handler(tauri::generate_handler![
            download_app,
            uninstall_app,
            ensure_dir_on_user_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
